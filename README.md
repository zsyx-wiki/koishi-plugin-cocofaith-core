<div align="center">
  <img src="./assets/coconut-water.png" width="168" alt="椰子水">

  <h1>CoCoFaith Core</h1>

  <p><strong>CoCoFaith v3 的数据与基础服务</strong></p>

  <p>
    <img alt="Koishi" src="https://img.shields.io/badge/Koishi-4.16%2B-60a5fa?style=flat-square">
    <img alt="Version" src="https://img.shields.io/badge/version-3.0.0--alpha.4-a78bfa?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/License-GPL--3.0-52b788?style=flat-square">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white">
  </p>
</div>

---

CoCoFaith v3 的数据服务，管理 UID、平台身份、信仰、职业、背包、经济和事务。
玩家命令由 [CoCoFaith Business](https://github.com/zsyx-wiki/koishi-plugin-cocofaith-business) 提供。

## 安装

在 Koishi 项目目录执行：

```sh
npm install @mueo/koishi-plugin-cocofaith-core@alpha
```

先启用数据库插件，再在 Koishi 中添加 `@mueo/cocofaith-core`。
完整玩法还需要 Business 和对应平台的 CoCoFaith Adapter。

## 配置

| 配置 | 默认值 |
| --- | --- |
| `registration.initialGold` | `300` |
| `gameDay.enabled` | `true` |
| `gameDay.timezone` | `Asia/Shanghai` |
| `gameDay.rolloverHour` | `7` |
| `gameDay.rolloverMinute` | `30` |
| `gameDay.checkIntervalSeconds` | `60` |
| `gameDay.lockTimeoutSeconds` | `1800` |

默认每天 07:30 切换游戏日，时间配置支持重载。

## 开发

插件提供 `faithCore` 服务。玩法通过 Business Scope 调用，Core 契约从
`@mueo/cocofaith-sdk/core` 导入。

```ts
await core.transaction.run(uid, async (tx) => {
  await tx.economy.pay({ gold: 100 })
  await tx.items.give('reward_item', 1)
}, { source: 'shop.purchase', idempotencyKey: `shop:${eventId}` })
```

内置数据位于 `src/data/`。其他玩法通过自身的 Business Scope 注册物品，
`item_id` 用于持久化识别，修改显示名称时保留原 ID。

当前为开发版，接口与数据结构可能调整。
版本记录见 [CHANGELOG.md](./CHANGELOG.md)。许可证：GPL-3.0-or-later。
