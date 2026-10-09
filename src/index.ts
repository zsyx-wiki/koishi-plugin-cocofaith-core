import { Context } from "koishi";
import { Config as ConfigSchema, type Config as CoreConfig } from "../config";
import { registerCoreModels } from "./database";
import { CORE_SERVICE_ORDER, FaithCoreService } from "./service";
export const name = "cocofaith-core";
export const inject = ["database"] as const;
export const Config = ConfigSchema;
export type Config = CoreConfig;
declare module "koishi" {
    interface Context {
        faithCore: FaithCoreService;
    }
}
export async function apply(ctx: Context, config: Config) {
    const logger = ctx.logger("cocofaith-core");
    const startedAt = Date.now();
    registerCoreModels(ctx);
    logger.debug("数据库模型已注册");
    const core = new FaithCoreService(ctx, config);
    ctx.set("faithCore", core);
    await core.lifecycle.init();
    logger.info(`Core 初始化完成（${Date.now() - startedAt}ms，API ${core.apiVersion}）`);
    logger.debug(`服务层级：${CORE_SERVICE_ORDER.join(" → ")}`);
}
export * from "@mueo/cocofaith-sdk/gameplay";
export * from "./bonus";
export * from "./business";
export { normalizeCoreConfig } from "./config/validation";
export * from "./data/easterEggs";
export * from "./data/faiths";
export * from "./data/items";
export * from "./data/openable-items";
export * from "./data/professions";
export * from "./database";
export * from "./economy";
export * from "./effects";
export * from "./errors";
export * from "./faith";
export * from "./health";
export * from "./hooks";
export * from "./identity";
export * from "./integrity";
export * from "./items";
export * from "./lifecycle";
export * from "./lock";
export * from "./permissions";
export * from "./professions";
export * from "./service";
export * from "./status-identities";
export * from "./transaction";
export * from "./types";
export * from "./users";
export * from "./validation";
export * from "./version";
