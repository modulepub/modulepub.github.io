---
title: excel
createTime: 2026/02/23 13:31:22
permalink: /zh-Hant/dev/excel/
---
# Excel 導入導出 spring boot starter 組件 業務代碼零侵入

TG-Excel 模塊提供了強大的 Excel 導入導出功能，採用模板驅動的方式，實現業務代碼與 Excel 處理邏輯的完全解耦。

## 核心優勢

### 1. 對業務代碼零侵入

- **業務模塊專注數據提供**：業務模塊只需要提供標準的數據接口，無需關心 Excel 的格式、樣式、合併單元格等複雜邏輯
- **Excel 模塊專注渲染**：Excel 模塊負責根據模板將數據渲染成 Excel 文件，支持所有 Excel 特性（樣式、函數、圖表等）
- **完全解耦**：導入導出功能與業務代碼完全分離，業務代碼中不需要引入任何 Excel 相關的依賴

### 2. 基於模板的靈活配置

- 使用 Excel 模板定義導出格式，支持複雜的表格樣式、合併單元格、公式等
- 模板可以隨時調整，無需修改代碼
- 支持多語言、多場景的模板切換

### 3. 完整的導入流程管理

- 支持模板下載，確保導入數據格式正確
- 支持歷史導入記錄查詢，可查看導入狀態和異常情況
- 支持導入結果下載，包含錯誤信息明細
- 異步導入處理，不阻塞用户操作

## 前端組件使用説明

### 後端引入組件
https://maven.org/
```xml

<dependency>
    <groupId>pub.module</groupId>
    <artifactId>spring-boot-starter-excel-api</artifactId>
   <version>3.5.1</version>
</dependency>

<dependency>
    <groupId>pub.module</groupId>
    <artifactId>spring-boot-starter-excel-biz</artifactId>
   <version>3.5.1</version>
</dependency>
```

### tg-excel-import 導入組件

**組件代碼**：
```vue
<template>
	<el-button icon="Upload" @click="openDialog">
		<slot />
	</el-button>

	<el-dialog v-model="dialogVisible" title="導入Excel" width="600px" :close-on-click-modal="false">
		<div class="upload-dialog-content">
			<div class="template-download">
				<el-button type="primary" icon="Download" @click="downloadTemplate">下載模板</el-button>
			</div>
			<div class="upload-area">
				<el-upload
					:action="uploadUrl"
					:headers="{ Authorization: 'Bearer ' + cache.getToken() }"
					:before-upload="beforeUpload"
					:on-success="handleSuccess"
					:show-file-list="false"
					drag
				>
					<el-icon class="el-icon--upload"><upload-filled /></el-icon>
					<div class="el-upload__text">將文件拖到此處，或<em>點擊上傳</em></div>
				</el-upload>
			</div>
			<div class="history-section">
				<div class="history-title">歷史導入記錄</div>
				<el-table :data="historyList" border size="small" max-height="300">
					<el-table-column prop="excelName" label="文件名" show-overflow-tooltip></el-table-column>

					<el-table-column prop="completed" label="是否完成" width="80" align="center">
						<template #default="scope">
							<el-tag :type="scope.row.completed ? 'success' : 'danger'" size="small">{{ scope.row.completed ? '已完成' : '未完成' }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="hasError" label="異常情況" width="80" align="center">
						<template #default="scope">
							<el-tag :type="!scope.row.hasError ? 'success' : 'danger'" size="small">{{ !scope.row.hasError ? '未發現' : '異常' }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="beginImportTime" label="導入時間" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="completeImportTime" label="完成時間" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
						<template #default="scope">
							<el-button type="primary" link @click="resultHandle(scope.row)">下載結果</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts" name="TgExcelImport">
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import constant from '@/utils/constant'
import { ElMessage } from 'element-plus/es'
import cache from '@/utils/cache'
import service from '@/utils/request'
import { Storage } from '@/utils/storage'

const props = defineProps({
	push: {
		type: String,
		default: ''
	},
	template: {
		type: String,
		default: ''
	}
})

const dialogVisible = ref(false)

let historyList = ref([])

const openDialog = () => {
	dialogVisible.value = true
	getStatus()
}

const downloadTemplate = () => {
	if (props.template) {
		window.open(props.template, '_blank')
	} else {
		ElMessage.warning('模板下載鏈接未配置')
	}
}

const uploadUrl = constant.apiUrl + `/cus/excel/import?pushUrl=${constant.apiUrl}${props.push}`

const handleSuccess: UploadProps['onSuccess'] = (res, file) => {
	let importExcelStatus = Storage.getItem('importExcelStatus')
	if (importExcelStatus) {
		importExcelStatus = importExcelStatus + ',' + res.data
		Storage.setItem('importExcelStatus', importExcelStatus)
	} else {
		importExcelStatus = res.data
		Storage.setItem('importExcelStatus', importExcelStatus)
	}
	console.log('importExcelStatus', importExcelStatus)
	ElMessage.success({
		message: '上傳成功',
		duration: 500,
		onClose: () => {
			dialogVisible.value = false
		}
	})
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
	if (file.size / 1024 / 1024 / 1024 / 1024 > 1) {
		ElMessage.error('文件大小不能超過100M')
		return false
	}
	return true
}

const getStatus = () => {
	let importExcelStatus = Storage.getItem('importExcelStatus')
	service.get(`/cus/excel/getImportStatus?keys=${importExcelStatus}`, {}).then(res => {
		historyList.value = res.data
		console.log('上傳狀態{}', historyList.value)
	})
}
const resultHandle = (params: { completed: any; batchId: any }) => {
	if (params.completed) {
		let url = `${constant.apiUrl}/cus/excel/downloadImportResult?batchId=${params.batchId}`
		service.get(url, { responseType: 'blob' }).then(res => {
			let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
			let fileName = params.batchId + '.xlsx'
			let a = document.createElement('a')
			a.href = URL.createObjectURL(blob)
			a.download = fileName
			a.click()
			URL.revokeObjectURL(a.href)
		})
	} else {
		ElMessage.warning('模板下載鏈接未配置')
	}
}
</script>

<style scoped>
.upload-dialog-content {
	padding: 10px;
}

.template-download {
	margin-bottom: 20px;
	text-align: right;
}

.upload-area {
	margin-bottom: 20px;
}

.history-section {
	border-top: 1px solid #ebeef5;
	padding-top: 15px;
}

.history-title {
	font-size: 14px;
	font-weight: bold;
	margin-bottom: 10px;
	color: #303133;
}

:deep(.el-upload-dragger) {
	padding: 20px;
}
</style>

```

**Props 參數**：

- `push`：導入接口地址（必填）
- `template`：模板下載鏈接（必填）

**使用示例**：

```vue

<template>
  <tg-excel-import
      push="/mgt/customer/customer/add"
      template="https://matchlove.oss-cn-beijing.aliyuncs.com/%E5%AE%A2%E6%88%B7%E5%AF%BC%E5%85%A5.xlsx"
  >
    導入
  </tg-excel-import>
</template>
```

**功能特性**：

- 支持拖拽上傳和點擊上傳
- 自動下載導入模板
- 顯示歷史導入記錄
- 支持查看導入狀態（已完成/未完成）
- 支持查看異常情況（正常/異常）
- 支持下載導入結果文件
- 文件大小限制：最大 100MB

**導入流程**：

1. 用户點擊"導入"按鈕打開對話框
2. 可選：點擊"下載模板"獲取標準導入模板
3. 上傳填寫好的 Excel 文件
4. 系統異步處理導入任務
5. 可在"歷史導入記錄"中查看導入狀態
6. 導入完成後可下載結果文件（包含錯誤信息）

### tg-excel-export 導出組件

**組件代碼**：
```vue
<template>
	<el-button icon="Download" @click="handleDownload">
		<slot />
	</el-button>
</template>

<script setup lang="ts" name="TgExcelExport">
import constant from '@/utils/constant'
import service from '@/utils/request'

const props = defineProps({
	data: {
		type: String,
		default: ''
	},
	template: {
		type: String,
		default: ''
	}
})

const handleDownload = () => {
	const downloadUrl = `${constant.apiUrl}/cus/excel/export?dataUrl=${constant.apiUrl}${props.data}&templatePath=${props.template}`
	service.get(downloadUrl, { responseType: 'blob' }).then(res => {
		let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
		let date = new Date()
		let fileName = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}.xlsx`
		let a = document.createElement('a')
		a.href = URL.createObjectURL(blob)
		a.download = fileName
		a.click()
		URL.revokeObjectURL(a.href)
	})
}
</script>

<style scoped>
.upload-dialog-content {
	padding: 10px;
}

.template-download {
	margin-bottom: 20px;
	text-align: right;
}

.upload-area {
	margin-bottom: 20px;
}

.history-section {
	border-top: 1px solid #ebeef5;
	padding-top: 15px;
}

.history-title {
	font-size: 14px;
	font-weight: bold;
	margin-bottom: 10px;
	color: #303133;
}

:deep(.el-upload-dragger) {
	padding: 20px;
}
</style>

```

**Props 參數**：

- `data`：數據接口地址（必填）
- `template`：導出模板路徑（必填）

**使用示例**：

```vue

<template>
  <tg-excel-export
      :data="`${state.dataListUrl}?pageNo=${state.pageNo}&pageSize=${state.pageSize}`"
      template="https://matchlove.oss-cn-beijing.aliyuncs.com/exportTemplate.xlsx"
  >
    導出
  </tg-excel-export>
</template>
```

**功能特性**：

- 一鍵導出當前查詢條件下的數據
- 自動生成帶時間戳的文件名（格式：年月日時分秒.xlsx）
- 支持大數據量導出
- 支持自定義查詢參數

## 模板配置説明

### 導入模板配置

導入模板需要包含以下要素：

- 第一列表頭：定義數據字段名稱，批註中加入導入的字段名稱，後端自動讀取每一列並封裝成對象以json的形式post業務數據接收接口。

**模板配置步驟**：

1. 在 Excel 中設計導入模板
2. 上傳模板到文件服務器（如阿里雲 OSS）
3. 在前端組件中配置模板下載鏈接
4. 後端根據模板解析數據並執行導入

**模板配置示例**：

```
模板字段説明：
- 客户姓名：必填，文本類型
- 手機號：必填，11位數字
- 身份證號：選填，18位數字
- 客户來源：選填，下拉選擇
- ...
```

### 導出模板配置

導出模板
自定義任何形式的內容，只需要填值的地方與導入的數據源路徑一致即可，路徑格式為$
{xx/xx},如果是數組對象，只需要把數組對象的訪問路徑配置到第一列的批註裏，後續列取值為該迭代對象的字段。

## 後端接口説明

### 導入接口

**接口路徑**：`POST /cus/excel/import`

**請求參數**：

- 自動傳入當前的主要Header到pushUrl,不侵入接口鑑權模塊
- `file`：上傳的 Excel 文件
- `pushUrl`：業務數據接口地址

**響應結果**：

```json
{
  "code": 200,
  "msg": "success",
  "data": "batchId"
}
```

### 導出接口

**接口路徑**：`GET /cus/excel/export`

**請求參數**：

- 自動傳入當前的主要Header到dataUrl,不侵入接口鑑權模塊
- `dataUrl`：業務數據接口地址
- `templatePath`：導出模板路徑

**響應結果**：Excel 文件流

### 導入狀態查詢接口

**接口路徑**：`GET /cus/excel/getImportStatus`

**請求參數**：

- `keys`：批量ID（多個用逗號分隔）

**響應結果**：

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "batchId": "xxx",
      "excelName": "客户導入.xlsx",
      "completed": true,
      "hasError": false,
      "beginImportTime": "2026-02-22 10:00:00",
      "completeImportTime": "2026-02-22 10:05:00"
    }
  ]
}
```

### 導入結果下載接口

- 自動新增一列包含每一行數據的導入結果。

**接口路徑**：`GET /cus/excel/downloadImportResult`

**請求參數**：

- `batchId`：批量ID

**響應結果**：Excel 文件流

## 業務代碼無侵入的優勢詳解

### 傳統方式的痛點

傳統 Excel 導入導出通常存在以下問題：

1. **業務代碼耦合嚴重**
    - 業務代碼中充斥着 Excel 相關的代碼
    - 需要引入 POI、EasyExcel 等依賴
    - 代碼可讀性差，維護困難

2. **格式調整困難**
    - 修改 Excel 格式需要修改代碼
    - 需要重新編譯部署
    - 無法快速響應業務需求變化

3. **靈活性差**
    - 難以支持複雜的 Excel 特性
    - 樣式、公式等需要硬編碼
    - 多場景需要多套代碼

4. **職責不清**
    - 業務代碼既要處理業務邏輯，又要處理 Excel 格式
    - 違反單一職責原則

### TG-Excel 的解決方案

1. **完全解耦**
    - 業務模塊只提供數據接口，不關心 Excel 格式
    - Excel 模塊獨立處理模板渲染和數據填充
    - 通過接口地址進行松耦合通信

2. **模板驅動**
    - 所有格式、樣式、公式都在模板中定義
    - 修改格式只需更新模板，無需改代碼
    - 支持非技術人員調整格式

3. **職責清晰**
    - 業務模塊：專注業務邏輯和數據提供
    - Excel 模塊：專注模板解析和數據渲染
    - 前端組件：專注用户交互和流程管理

4. **易於擴展**
    - 新增導入導出場景只需添加模板
    - 支持多語言、多場景模板切換
    - 無需修改業務代碼

5. **提升開發效率**
    - 減少重複代碼
    - 降低維護成本
    - 加快開發速度

## 實戰案例

示例項目地址：http://tg.module.pub（國內訪問不穩定）

### 客户管理模塊導入導出

**場景**：客户管理模塊需要支持批量導入客户信息和導出客户列表

**實現步驟**：

1. **準備導入模板**
    - 設計 Excel 模板，包含客户姓名、手機號、身份證號等字段
    - 上傳到文件服務器：`https://matchlove.oss-cn-beijing.aliyuncs.com/%E5%AE%A2%E6%88%B7%E5%AF%BC%E5%85%A5.xlsx`

2. **準備導出模板**
    - 設計 Excel 模板，包含表頭、樣式、統計信息
    - 上傳到文件服務器：`https://matchlove.oss-cn-beijing.aliyuncs.com/exportTemplate.xlsx`

3. **前端集成**

```vue

<template>
  <el-space>
    <tg-excel-import
        push="/mgt/customer/customer/add"
        template="https://matchlove.oss-cn-beijing.aliyuncs.com/%E5%AE%A2%E6%88%B7%E5%AF%BC%E5%85%A5.xlsx"
    >
      導入
    </tg-excel-import>
    <tg-excel-export
        :data="`${state.dataListUrl}?pageNo=${state.pageNo}&pageSize=${state.pageSize}`"
        template="https://matchlove.oss-cn-beijing.aliyuncs.com/exportTemplate.xlsx"
    >
      導出
    </tg-excel-export>
  </el-space>
</template>
```

4. **後端接口**
    - 客户數據接口：`/mgt/customer/customer/list`
    - 客户新增接口：`/mgt/customer/customer/add`
    - Excel 模塊自動處理導入導出邏輯

**優勢體現**：

- 客户模塊代碼無需任何修改
- 導入導出功能獨立於業務邏輯
- 模板可隨時調整，無需重新部署

## 開發環境&框架環境

- 框架： spring boot
- 依賴管理：Maven

## 版本信息

版本命名和spring boot 版本呼應，比如 spring boot 3.5.5 對應的 TG-EXCEL版本 是 3.5.*
，即取決於所在項目的springboot框架版本，請查看pom.xml文件中依賴的springboot版本。 
