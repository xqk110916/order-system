import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // 引入 path 模块

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 配置 @ 指向 src 目录
    }
  },
  server: {
    port: 4000, // 设置默认启动端口为 4000
    host: true // 默认启用 IP，让服务器外部可访问
  }
});
