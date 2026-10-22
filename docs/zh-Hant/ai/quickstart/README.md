---
title: 讓 AI 啓動項目
description: 複製一段説明給 AI，讓 TG-boot 的 JDK、Maven、數據庫、Redis、後端與前端環境自動建立。
---

<div class="doc-eyebrow">AI BOOTSTRAP · COPY & RUN</div>

<p class="doc-lead">
  不需要先自己安裝一長串開發環境。把下面這段説明整段複製給能執行 PowerShell 的 AI，
  讓它直接運行 TG-boot 自帶的啓動腳本、觀察日誌、處理失敗，最後把可訪問地址交給你。
</p>

<div class="doc-metrics">
  <div class="doc-metric"><strong>1<em> 篇</em></strong><span>複製給 AI 的説明</span></div>
  <div class="doc-metric"><strong>1<em> 條</em></strong><span>啓動入口</span></div>
  <div class="doc-metric"><strong>6<em> 項</em></strong><span>自動準備的環境</span></div>
  <div class="doc-metric"><strong>0<em> 次</em></strong><span>手工安裝</span></div>
</div>

<ai-setup-hant />

## 一、AI 會替你完成什麼

這段説明不是“操作建議”，而是一份可執行的啓動契約。AI 需要實際運行腳本，而不是把命令再轉述給你。

| 步驟 | 實際動作 |
| --- | --- |
| 準備運行時 | 檢查並補齊 `.tools` 中的 JDK、Maven、數據庫、Node 與 Redis |
| 初始化數據庫 | 啓動本機數據庫，空庫時導入 `sql/tg-boot.sql` 與本地登錄數據 |
| 啓動緩存 | 啓動 Redis，供登錄會話使用 |
| 啓動後端 | 用 JDK 27 + Maven 啓動 runner，端口 `9999` |
| 啓動前端 | 用 Node 安裝依賴並啓動中台 H5，端口 `9100` |
| 驗證交付 | 檢查日誌、訪問兩個地址，並報告實際狀態 |

::: info 這不是“遠程一鍵部署”
腳本運行在你指定的這台 Windows 電腦上。它不會替你購買服務器、配置域名或部署到公網。
它解決的是：**把本地完整開發環境從零建立起來。**
:::

## 二、你只需要做三件事

1. **打開一個能執行 PowerShell 的 AI 編碼工具**，並讓它進入 `tg-boot` 倉庫根目錄；
2. 點擊上面的 **“複製給 AI”**；
3. 把整段説明粘貼給 AI，發送，然後等它執行並返回地址。

如果 AI 只輸出了步驟而沒有執行，補一句：

```text
請直接執行，不要只給步驟。你可以運行 PowerShell 命令，並在每一步後檢查實際輸出。
```

## 三、成功標準

後端日誌中出現：

```text
Started StartApplication
```

並且這兩個地址可以訪問：

| 用途 | 地址 |
| --- | --- |
| 中台登錄 | <http://127.0.0.1:9100/pages/manage/login/index> |
| 接口文檔 | <http://127.0.0.1:9999/swagger-ui/index.html> |

本地賬號：`tgadmin` / `Tgboot@123`。

::: danger 本地口令不要外帶
這組賬號來自本地初始化數據，只用於打開開發環境。
不要用於測試環境、生產環境，也不要把本地數據庫快照直接當成生產數據。
:::

## 四、如果 AI 卡住了

讓 AI 按這個順序排查，並把完整報錯發回來：

| 現象 | 優先檢查 |
| --- | --- |
| 後端啓動失敗 | 數據庫是否啓動、`3306` 是否被佔用 |
| 登錄後接口 401 | Redis 是否在 `127.0.0.1:6379` 運行 |
| Maven 找不到模塊 | 是否在倉庫根目錄執行，是否保留 `-am` |
| 端口衝突 | `3306`、`6379`、`9999`、`9100` 是否被舊進程佔用 |
| 前端請求失敗 | `.env.development` 的後端地址是否為 `9999` |
| RabbitMQ 連接失敗 | 是否誤配了 `spring.rabbitmq.*`；開發環境默認使用嵌入式 Rabbit |

::: tip 只需給 AI 一句話
把“失敗步驟 + 完整錯誤 + 已經嘗試的修復”發給它，讓它繼續排查。
不要只發最後一行日誌，最早出現的 `Caused by` 通常才是根因。
:::

## 五、人工兜底

只有在 AI 無法執行命令、或你明確想手動接管時，才需要看這一節。

```powershell
git clone https://gitee.com/pub_module/tg-boot.git
cd tg-boot
powershell -ExecutionPolicy Bypass -File scripts\up.ps1
```

如果 `.tools` 缺少運行時：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\fetch-tools.ps1
powershell -ExecutionPolicy Bypass -File scripts\up.ps1
```

已有數據庫和 Redis 時，也可以單獨啓動後端：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\run-runner.ps1
```

這些命令只是兜底。正常路徑是：**複製説明給 AI，讓 AI 執行並驗證。**

## 六、下一步

環境起來之後，不要停在登錄頁。先讓 AI 做一次只讀分析，再進入真實模塊開發。

<div class="doc-cards">
  <a class="doc-card" href="/zh-Hant/ai/architecture/">
    <span class="doc-card__tag">NEXT · ARCHITECTURE</span>
    <h3>理解架構與邊界</h3>
    <p>為什麼默認是一個進程？AUTO 路由如何工作？拆分時到底改什麼？</p>
  </a>
  <a class="doc-card" href="/zh-Hant/ai/practice/">
    <span class="doc-card__tag">NEXT · HANDS-ON</span>
    <h3>新增一個模塊</h3>
    <p>從 Maven 骨架到 Controller、MQ、runner 裝配與架構門禁。</p>
  </a>
</div>
