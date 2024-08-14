import { createMemoryHistory, createWebHashHistory, createRouter } from 'vue-router'

import Canvas from '../views/Canvas.vue'
import PlayVideo from '../views/PlayVideo.vue'
import Fragment from '../views/Fragment.vue'
import Base from '../views/Base.vue'
import Home from '../views/Home.vue'
import CandyCrush from '../views/CandyCrush.vue'
import AlphaVedio from '../views/AlphaVedio.vue'
import ThreeJs from '../views/ThreeJs.vue'
import Phaser from '../views/Phaser.vue'
import BattleFly from '../views/BattleFly.vue'

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/fly',
    children: [
      // { path: '/canvas', component: Canvas },
      // { path: '/video', component: PlayVideo },
      { path: '/fragment', component: Fragment },
      { path: '/base', component: Base },
      { path: '/candy', component: CandyCrush },
      { path: '/alpha', component: AlphaVedio },
      { path: '/threejs', component: ThreeJs },
      { path: '/phaser', component: Phaser },
      { path: '/fly', component: BattleFly }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
