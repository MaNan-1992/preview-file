<template>
  <div>
    {{input ? '🐧 输入网址' : '👆🏻 上传预览'}}:
    <input v-show="input" type="text" v-model="url" placeholder="http://" />
    <button type="button" v-show="input" @click.stop="loadFromUrl">预览</button>
    <input v-show="!input" type="file" @change="handleChange" />
    <el-button type="primary" @click="input=!input">切换</el-button>
    <div class="well" ref="output"></div>
  </div>
</template>

<script>
import { getExtend, readBuffer, render } from '@/components/util'
import axios from 'axios';
export default {
  name: 'HelloWorld',
  data() {
    return {
      filename: '', // 文件名
      input: false, // 使用输入框
      last: null, // 上个渲染实例
      url: 'http://flyfish.group/%E6%95%B0%E6%8D%AE%E4%B8%AD%E5%8F%B0%E7%AC%94%E8%AE%B0(1).docx' // 网址
    }
  },
  created() {},
  methods: {
     // 从url加载
    loadFromUrl() {
      // 要预览的文件地址
      const { url } = this;
      const filename = url.substr(url.lastIndexOf('/') + 1);
      // 拼接iframe请求url
      axios({
        url,
        method: 'get',
        responseType: 'blob',
      }).then(({ data }) => {
        if (!data) {
          console.error('文件下载失败');
          return false
        }
        const file = new File([ data ], filename, {});
        this.handleChange({ target: { files: [ file ] } });
      })
    },
    async handleChange(e) {
      this.loading = true
      try {
        const [file] = e.target.files
        this.filename = (file.name && decodeURIComponent(file.name)) || ''
        const arrayBuffer = await readBuffer(file)
        this.last = await this.displayResult(arrayBuffer, file)
      } catch (e) {
        console.error(e)
      } 
    },
    displayResult(buffer, file) {
      // 取得文件名
      const { name } = file
      // 取得扩展名
      const extend = getExtend(name)
      // 输出目的地
      const { output } = this.$refs
      // 生成新的dom
      const node = document.createElement('div')
      // 添加孩子，防止vue实例替换dom元素
      if (this.last) {
        output.removeChild(this.last.$el)
        this.last.$destroy()
      }
      const child = output.appendChild(node)
      // 调用渲染方法进行渲染
      return new Promise((resolve, reject) =>
        render(buffer, extend, child).then(resolve).catch(reject)
      )
    }
  }
}
</script>

<style scoped>
.well {
  display: block;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  margin: 5px;
  width: calc(100% - 12px);
  height: calc(100vh - 73px);
  overflow: auto;
}
</style>