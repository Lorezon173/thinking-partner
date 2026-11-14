# Thinking Partner · 思考伙伴

一个帮助你拆解当前问题、按需补知识并继续探索的 Agent Skill。你可以在阶段转折时整理理解、判断与未决问题，并把获准保存的内容留在自己的项目里。

## 开始使用

在支持读取本地文件的 Agent 中，指向 [SKILL.md](skills/thinking-partner/SKILL.md)，然后描述你当前的问题。例如：

> 请用思考伙伴帮我梳理这个问题。我已经试过两种做法，但不知道怎样比较它们。

需要留存时，指定项目目录并说明允许保存的范围。下次可让 Agent 读取选定的记录继续讨论。若你的客户端支持 Agent Skills，可按客户端的安装说明添加整个 `skills/thinking-partner/` 目录。

## 仓库结构

```text
skills/thinking-partner/
├── SKILL.md
└── references/
    ├── records.md
    └── improvement.md
```

入口描述对话方式；两个参考文件分别说明本地记录及反馈改进。恢复依赖宿主的文件访问能力及获准保存的材料。当前版本为 0.1.0，内容以中文为主。

## 授权

本仓库公开供查阅，目前尚未指定开源许可证。
