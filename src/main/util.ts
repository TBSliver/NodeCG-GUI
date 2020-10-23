import path from 'path';

export function nodecgPath(...args: string[]) {
  return path.join(process.cwd(), 'vendor', 'nodecg', ...args);
}