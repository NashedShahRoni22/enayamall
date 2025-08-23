import Slider from './components/home/Slider'
import Category from './components/home/Category'
import Recommended from './components/home/Recommended'
import Clearance from './components/home/Clearance'
import Newarrival from './components/home/Newarrival'
import Babymilestone from './components/home/Babymilestone'
import LastAdd from './components/home/LastAdd'

export default function page() {
  return (
    <main>
      <Slider/>
      <Category/>
      <Recommended/>
      <Babymilestone/>
      <Clearance/>
      <Newarrival/>
      <LastAdd/>
    </main>
  )
}
