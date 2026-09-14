import type { FaithDefinition } from "../types";

export class FaithRegistryServiceBase {
  protected registry = new Map<string, Readonly<FaithDefinition>>();
  private prayerOwners = new Map<string, string>();
  register(definition: FaithDefinition, options: { override?: boolean } = {}) {
    const item = validateFaith(definition);
    const previous = this.registry.get(item.name);
    if (!options.override && previous) throw new Error(`信仰已注册：${item.name}`);
    if (item.prayer_word) {
      const owner = this.prayerOwners.get(item.prayer_word);
      if (owner && owner !== item.name) throw new Error(`祷词已由信仰 ${owner} 使用`);
    }
    if (previous?.prayer_word && previous.prayer_word !== item.prayer_word) this.prayerOwners.delete(previous.prayer_word);
    this.registry.set(item.name, item);
    if (item.prayer_word) this.prayerOwners.set(item.prayer_word, item.name);
    return item;
  }
  registerMany(definitions: readonly FaithDefinition[]) {
    const registry = new Map(this.registry), prayerOwners = new Map(this.prayerOwners);
    try { return definitions.map((item) => this.register(item)); }
    catch (error) { this.registry = registry; this.prayerOwners = prayerOwners; throw error; }
  }
  unregister(name: string) {
    const key = name.trim(), current = this.registry.get(key);
    if (!current) return false;
    if (current.prayer_word) this.prayerOwners.delete(current.prayer_word);
    return this.registry.delete(key);
  }
  get(name: string) { return this.registry.get(name.trim()); }
  require(name: string) { const item = this.get(name); if (!item) throw new Error(`信仰不存在：${name}`); return item; }
  has(name: string) { return !!this.get(name); }
  all() { return [...this.registry.values()]; }
  byPath(path: string) { const result: Readonly<FaithDefinition>[] = []; for (const item of this.registry.values()) if (item.path === path) result.push(item); return result; }
  resolvePrayerWord(word: string) { const name = this.prayerOwners.get(word.trim()); return name ? this.registry.get(name) : undefined; }
  clear() { this.registry.clear(); this.prayerOwners.clear(); }
}

function validateFaith(value: FaithDefinition): Readonly<FaithDefinition> {
  if (!value || typeof value !== "object") throw new TypeError("信仰定义必须是对象");
  for (const key of ["name", "path"] as const) if (typeof value[key] !== "string" || !value[key].trim() || value[key].length > 64) throw new Error(`信仰字段无效：${key}`);
  if (value.type !== "fixed" && value.type !== "dynamic") throw new Error("信仰类型无效");
  if (!Number.isSafeInteger(value.believer_count) || value.believer_count < 0) throw new Error("信徒数量无效");
  const prayer = value.prayer_word?.trim();
  if (prayer && prayer.length > 1024) throw new Error("祷词不能超过 1024 字符");
  return Object.freeze({ ...value, name: value.name.trim(), path: value.path.trim(), prayer_word: prayer || undefined, custom_professions: Object.freeze({ ...(value.custom_professions ?? {}) }), metadata: Object.freeze({ ...(value.metadata ?? {}) }) });
}
