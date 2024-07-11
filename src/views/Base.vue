<template>
  <div class="base-wrap"></div>
</template>

<script lang="ts" setup>
// 自定义迭代器
const range: any = {
  from: 2,
  to: 5,
  [Symbol.iterator]() {
    this.current = this.from
    return this
  },
  next() {
    if (this.current <= this.to) {
      return { done: false, value: this.current++ }
    } else {
      return { done: true }
    }
  }
}

console.log(range.next())
console.log(range.next())
for (let i of range) {
  console.log(i)
}

// 日期,注意getDay()是获取星期几，而getDate()是获取日期
const getDay = () => {
  let date = new Date()
  let d = date
  const [day, month, year, hours, mins] = [
    '0' + d.getDate(),
    '0' + (d.getMonth() + 1),
    '' + d.getFullYear(),
    '0' + d.getHours(),
    '0' + d.getMinutes()
  ].map((component) => component.slice(-2)) //得到后两位

  return `${day}.${month}.${year} ${hours}:${mins}`
}

console.log(getDay())

// weakMap被应用于缓存数据，比如用户信息，可以避免频繁的请求服务器

// getter/setter
const user = {
  _name: 'John',
  get name() {
    return this._name
  },
  set name(value) {
    if (value.length < 4) {
      this._name = value
    } else {
      console.log('太长了')
    }
  }
}

console.log(user.name)
user._name = 'kkkdff'
console.log(user._name)

// promise
Promise.resolve
// 等同于
let promise: any = new Promise((resolve) => resolve('res'))
// 现代浏览器可以直接在modules中使用await,若没有modules可以使用立即执行表达式函数
// (async () => {
//   let response = await fetch('/article/promise-chaining/user.json');
//   let user = await response.json();
//   // ...
// })();

function* generateSequence() {
  yield 1
  yield 2
  return 3
}

let gen = generateSequence()

// console.log(gen.next())
for (let i of gen) {
  console.log(i)
}

</script>

<style lang="scss" scoped>
.base-wrap {
}
</style>
