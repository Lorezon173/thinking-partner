# Thinking Partner · 思考伙伴

一个帮助你拆解当前问题、按需补知识并继续探索的 Agent Skill。你可以在阶段转折时整理理解、判断与未决问题，并把获准保存的内容留在自己的项目里。

## 项目路线

| 阶段 | 当前状态与目标 |
| --- | --- |
| 1. Agent Skill | **当前阶段（v0.1.0）**。先借助现有 Agent 验证思考引导、按需补知识和本地留存。用实际问题观察用户能否形成自己的理解、判断和理由。 |
| 2. 接入宿主 Agent 与 MCP | **后续计划**。当保存、读取、纠正和删除的规则稳定，且文件方式出现实际瓶颈时，将这些操作封装为 MCP 服务，并经宿主 Agent 调用。Skill 继续负责引导对话，宿主负责模型调用和会话管理。 |
| 3. 独立 Agent 平台 | **长期目标**。在前两阶段验证价值后，提供独立的对话界面、上下文与知识管理、记录恢复和反馈改进能力，帮助用户从模糊问题逐步形成有依据的判断和可供继续工作的方案。 |

## 快速启动

需要 Git、Node.js 22 或更新版本，以及你准备使用的宿主。先准备一个要用于讨论的项目目录。以下示例从该项目的父目录运行，项目目录名为 `my-project`。

```sh
git clone https://github.com/Lorezon173/thinking-partner.git
node ./thinking-partner/scripts/install.mjs --agent all --project ./my-project
```

只安装一个宿主时，将 `all` 换成 `claude`、`codex` 或 `dsh`。传入 Git 项目时使用仓库根目录。省略 `--project` 时使用终端当前目录。目录中已有内容一致的 Skill 时可以重复运行。发现不同版本时，脚本会停止并保留原文件。

| 宿主 | 项目内安装位置 | 启动与调用 |
| --- | --- | --- |
| Claude Code | `.claude/skills/thinking-partner/` | 从目标项目运行 `claude`，在新会话输入 `/thinking-partner` 加上你的问题。 |
| Codex | `.agents/skills/thinking-partner/` | 从目标项目运行 `codex`，在新会话输入 `$thinking-partner` 加上你的问题，也可通过 `/skills` 查看。 |
| DeepSeek Harness | `.dsh/skills/thinking-partner/` | 在已启用文件系统 Skill Provider 的配置中，打开目标项目并新建会话。可直接说「请加载 thinking-partner Skill，帮我探索下面的问题」。 |

目录与加载规则参考 [Claude Code Skills](https://code.claude.com/docs/en/skills)、[OpenAI Docs](https://learn.chatgpt.com/docs/build-skills) 和 [DeepSeek Harness Skills](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md)。

首次使用可以直接描述问题：

> 我试过两种做法，但不知道怎么比较。先帮我找出比较标准，再给我一个值得继续想的问题。

需要留存时，再告诉 Agent 保存到哪个项目、允许保存哪些关键片段。下次选择相关记录继续讨论。如果宿主未发现 Skill，可以让它直接读取 [SKILL.md](skills/thinking-partner/SKILL.md)，并检查目标项目与 Skill 目录是否匹配。

### 兼容性验证

本地隔离项目已检查三端安装、文件完整性和重复执行。Codex CLI 0.166.0 已通过原生技能列表发现项目级入口。Claude Code 2.1.285 已在本地会话中展开 slash 命令对应的 Skill 正文。DeepSeek Harness 原生文件系统 Provider 0.2.2-rc.1 已发现并读取正文和附件。Claude 的回环模型探针未收到请求，DeepSeek Harness 桌面会话和三端真实模型对话待验证。

## 仓库结构

```text
skills/thinking-partner/
├── SKILL.md
└── references/
    ├── records.md
    └── improvement.md
```

入口描述对话方式，两个参考文件分别说明本地记录及反馈改进。恢复依赖宿主的文件访问能力及获准保存的材料。当前版本为 0.1.0，内容以中文为主。

## 授权

本仓库公开供查阅，目前尚未指定开源许可证。
