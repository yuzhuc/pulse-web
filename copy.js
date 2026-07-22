import { cp, rm, mkdir, chmod } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const OUTPUT_DIR = './standalone';

// 1. 完全清空输出目录
await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });

// 准备要复制的任务列表（源路径 -> 目标路径）
const copyTasks = [];

// 2. 复制 .next/standalone/* 到 standalone/
const standaloneSrc = '.next/standalone';
if (existsSync(standaloneSrc)) {
	// 注意：cp 递归复制 standaloneSrc 的**内容**到 OUTPUT_DIR（不包含 standaloneSrc 目录本身）
	copyTasks.push(
		cp(standaloneSrc, OUTPUT_DIR, { recursive: true, force: true }),
	);
}

// 3. 复制 .next/static 到 standalone/.next/static
const staticSrc = '.next/static';
const staticDest = join(OUTPUT_DIR, '.next', 'static');
if (existsSync(staticSrc)) {
	// 先确保目标父目录存在
	await mkdir(join(OUTPUT_DIR, '.next'), { recursive: true });
	copyTasks.push(cp(staticSrc, staticDest, { recursive: true, force: true }));
}

// 4. 复制 public 到 standalone/public
const publicSrc = './public';
const publicDest = join(OUTPUT_DIR, 'public');
if (existsSync(publicSrc)) {
	copyTasks.push(cp(publicSrc, publicDest, { recursive: true, force: true }));
}

// 5. 并发执行所有复制任务（极大提升速度）
await Promise.all(copyTasks);

// 6. 设置 server.js 可执行（仅 Unix-like 系统）
const serverPath = join(OUTPUT_DIR, 'server.js');
if (existsSync(serverPath) && process.platform !== 'win32') {
	await chmod(serverPath, 0o755);
}

console.log('✅ Build 已打包到 standalone 目录');
