export default class Vars {
  private context: Record<string, any>;

  constructor() {
    this.context = {};
  }

  // Lưu biến
  set(key: string, value: any) {
    this.context[key] = value;
  }

  // Lấy biến
  get(key: string): any {
    return this.context[key];
  }

  // Lấy toàn bộ object
  toObject(): Record<string, any> {
    return this.context;
  }

  // Render biến theo dạng {{ var }}
  interpolate(input: string): string {
    const regex = /{{\s*([^{}\s]+)\s*}}/g;
    return input.replace(regex, (_, key) => {
      const val = this.get(key);
      if (val === undefined) {
        console.warn(`⚠️ Variable not found: ${key}`);
        return "";
      }
      return String(val);
    });
  }
}
