<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const copied = ref(false)
const failed = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

const prompt = "# TG-boot 一键启动说明（给 AI）\n\n你在一台 Windows 电脑上，请直接执行下面的步骤，不要只输出操作指南。\n目标：从零把 TG-boot 的完整开发环境跑起来，并在结束时给出可访问地址。\n\n## 0. 确认仓库位置\n\n优先进入本地已有的 tg-boot 仓库根目录。\n如果还没有仓库，在当前工作目录克隆：\n\ngit clone https://gitee.com/pub_module/tg-boot.git\ncd tg-boot\n\n如果已经在 tg-boot 仓库根目录，跳过克隆。\n\n## 1. 执行唯一入口\n\npowershell -ExecutionPolicy Bypass -File scripts\\up.ps1\n\n说明：\n- 不要预先手动安装 JDK、Maven、MySQL、Node、Redis，脚本会使用并补齐仓库内的 .tools。\n- 如果 .tools 缺少二进制，先执行 scripts\\fetch-tools.ps1，再执行 scripts\\up.ps1。\n- 脚本会启动本机数据库 127.0.0.1:3306（root / root，库名 tg-boot）。\n- 脚本会启动 Redis 127.0.0.1:6379，登录会话缓存需要它。\n- 脚本会用 JDK 27 和 Maven 启动后端 runner，端口 9999。\n- 脚本会用 Node 安装依赖并启动中台 H5，端口 9100。\n- 首次执行会下载 Maven 依赖与前端包，请保持网络。\n- 未配置 RabbitMQ 时，runner 使用嵌入式 Rabbit，不需要另装。\n\n## 2. 判断是否成功\n\n后端日志出现 Started StartApplication，并且这两个地址可以打开：\n\n- 中台登录：http://127.0.0.1:9100/pages/manage/login/index\n- 接口文档：http://127.0.0.1:9999/swagger-ui/index.html\n\n本地登录账号：tgadmin / Tgboot@123\n这个口令只用于本地开发，不要带到测试或生产环境。\n\n## 3. 如果失败\n\n按顺序检查，并保留完整报错：\n\n1. 检查端口 3306、6379、9999、9100 是否被占用。\n2. 检查 .tools 是否完整；缺失则执行 scripts\\fetch-tools.ps1。\n3. 检查数据库是否已初始化；空库时脚本会导入 sql/tg-boot.sql 与 sql/local-login.sql。\n4. 如果 Redis 未启动，登录会话会失败，先确认 127.0.0.1:6379 可连接。\n5. 如果 Maven 报模块找不到，确认在仓库根目录执行，并保留 -am 参数。\n6. 不要修改业务代码，不要提交 .tools/mysql-data，不要把本地口令带到生产。\n\n如果仍然失败，输出：失败步骤、完整错误、已经尝试的修复、下一步建议。\n\n## 4. 交付\n\n执行完成后，用一句话报告状态，并返回上面的两个地址和登录账号。\n请实际执行并验证，不要只给命令让我自己执行。"

async function copyPrompt() {
  let succeeded = false

  try {
    await navigator.clipboard.writeText(prompt)
    succeeded = true
  }
  catch {
    const textarea = document.createElement('textarea')
    textarea.value = prompt
    textarea.setAttribute('readonly', 'readonly')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      succeeded = document.execCommand('copy')
    }
    finally {
      document.body.removeChild(textarea)
    }
  }

  copied.value = succeeded
  failed.value = !succeeded

  if (resetTimer)
    clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    copied.value = false
    failed.value = false
  }, 2600)
}

onBeforeUnmount(() => {
  if (resetTimer)
    clearTimeout(resetTimer)
})
</script>

<template>
  <section id="ai-setup" class="ai-setup">
    <header class="ai-setup__head">
      <div>
        <div class="ai-setup__eyebrow">COPY FOR AI · AUTO SETUP</div>
        <h2 class="ai-setup__title">把这篇启动说明复制给 AI</h2>
        <p class="ai-setup__desc">
          不需要先自己装 JDK、Maven、数据库、Redis 或 Node。
          整段粘贴给能执行 PowerShell 的 AI 编码工具，让它直接执行、观察日志并处理失败。
        </p>
      </div>
      <button
        type="button"
        class="ai-setup__copy"
        :class="{ 'is-copied': copied, 'is-failed': failed }"
        @click="copyPrompt"
      >
        <span class="ai-setup__copy-icon" aria-hidden="true">{{ copied ? '✓' : failed ? '!' : '⧉' }}</span>
        <span>{{ copied ? '已复制，去粘贴给 AI' : failed ? '复制失败，请手动选择' : '复制给 AI' }}</span>
      </button>
    </header>

    <div class="ai-setup__meta">
      <span><i />1 段说明</span>
      <span>1 条启动入口</span>
      <span>环境自动建立</span>
      <a
        href="https://gitee.com/pub_module/tg-boot"
        target="_blank"
        rel="noopener noreferrer"
      >Gitee 仓库 ↗</a>
    </div>

    <div class="ai-setup__doc">
      <div class="ai-setup__docbar">
        <span class="ai-setup__dots"><i /><i /><i /></span>
        <span class="ai-setup__filename">setup-for-ai.md</span>
        <span class="ai-setup__lang">MARKDOWN</span>
      </div>
      <pre class="ai-setup__pre"><code>{{ prompt }}</code></pre>
    </div>

    <p class="ai-setup__hint" aria-live="polite">
      {{ copied ? '已复制。把它粘贴给 AI，发送后等它执行完成。' : failed ? '浏览器拒绝了自动复制。请手动选中下方说明并复制。' : '粘贴后让 AI 直接执行脚本，不要只让它输出步骤。完成后应返回 9100 与 9999 两个地址。' }}
    </p>
  </section>
</template>

<style scoped>
.ai-setup {
  position: relative;
  margin: 34px 0 10px;
  padding: clamp(20px, 3vw, 30px);
  overflow: hidden;
  border: 1px solid rgba(46, 230, 197, 0.22);
  border-radius: 18px;
  background:
    radial-gradient(circle at 100% 0%, rgba(46, 230, 197, 0.09), transparent 40%),
    radial-gradient(circle at 0% 100%, rgba(91, 140, 255, 0.06), transparent 42%),
    rgba(7, 14, 20, 0.82);
}

.ai-setup::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(46, 230, 197, 0.8), transparent);
}

.ai-setup__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 28px;
}

.ai-setup__eyebrow {
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #74cabb;
}

.ai-setup__title {
  padding-top: 0 !important;
  margin: 12px 0 0 !important;
  border-top: 0 !important;
  font-size: clamp(23px, 2.8vw, 32px) !important;
  font-weight: 750;
  letter-spacing: -0.04em;
  color: #effcff !important;
}

.ai-setup__title::before {
  display: none !important;
}

.ai-setup__desc {
  max-width: 650px;
  margin: 12px 0 0 !important;
  font-size: 13px;
  line-height: 1.85;
  color: #8fa9b8;
}

.ai-setup__copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  flex-shrink: 0;
  min-height: 48px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(120deg, #8bffea, #2ee6c5 58%, #7cddff);
  color: #03120f;
  font-family: var(--vp-font-family-base);
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(46, 230, 197, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.55);
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.ai-setup__copy:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 38px rgba(46, 230, 197, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.ai-setup__copy.is-copied {
  background: linear-gradient(120deg, #d9fff7, #7dffe8 58%, #c6fff1);
}

.ai-setup__copy.is-failed {
  color: #1b1003;
  background: linear-gradient(120deg, #ffe4b6, #ffc46b 58%, #ffdda0);
}

.ai-setup__copy-icon {
  font-size: 15px;
  line-height: 1;
}

.ai-setup__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px 16px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(125, 175, 205, 0.12);
  font-family: var(--vp-font-family-mono);
  font-size: 8.5px;
  letter-spacing: 0.04em;
  color: #678594;
}

.ai-setup__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ai-setup__meta i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--mc-mint);
  box-shadow: 0 0 8px rgba(46, 230, 197, 0.7);
}

.ai-setup__meta a {
  margin-left: auto;
  color: #7dffe8;
  text-decoration: none;
}

.ai-setup__meta a:hover {
  color: #d8fff9;
}

.ai-setup__doc {
  margin-top: 18px;
  overflow: hidden;
  border: 1px solid rgba(125, 175, 205, 0.16);
  border-radius: 13px;
  background: #060b11;
}

.ai-setup__docbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(125, 175, 205, 0.1);
  background: rgba(11, 20, 28, 0.8);
}

.ai-setup__dots {
  display: inline-flex;
  gap: 5px;
}

.ai-setup__dots i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #314955;
}

.ai-setup__dots i:first-child {
  background: var(--mc-mint);
}

.ai-setup__filename {
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  color: #8ba6b5;
}

.ai-setup__lang {
  margin-left: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 7px;
  letter-spacing: 0.12em;
  color: #4f6c7b;
}

.ai-setup__pre {
  max-height: 440px;
  margin: 0 !important;
  padding: 18px 20px !important;
  overflow: auto;
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  font-family: var(--vp-font-family-mono) !important;
  font-size: 11.5px !important;
  line-height: 1.8 !important;
  color: #aac2cf !important;
  white-space: pre-wrap;
  word-break: break-word;
  tab-size: 2;
  scrollbar-width: thin;
}

.ai-setup__pre code {
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  color: inherit !important;
  font-size: inherit !important;
  font-weight: 400 !important;
  white-space: inherit;
}

.ai-setup__hint {
  margin: 13px 0 0 !important;
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  line-height: 1.7;
  color: #5f7e8c;
}

@media (max-width: 720px) {
  .ai-setup {
    padding: 18px;
    border-radius: 14px;
  }

  .ai-setup__head {
    flex-direction: column;
    gap: 18px;
  }

  .ai-setup__copy {
    width: 100%;
    min-height: 46px;
  }

  .ai-setup__meta {
    gap: 8px 12px;
    font-size: 7.5px;
  }

  .ai-setup__meta a {
    margin-left: 0;
  }

  .ai-setup__pre {
    max-height: 380px;
    padding: 14px !important;
    font-size: 10.5px !important;
  }
}
</style>
