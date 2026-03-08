import {LayoutTextFlipDemo} from './ui/LayoutFlip'
import { NoiseBackground } from './ui/NoiseBackground'
import { IconPlus } from '@tabler/icons-react'

function Header({ onAddClick }) {
  return (
    <>
      <div className='flex w-full items-center justify-between'>
        <LayoutTextFlipDemo/>
        <NoiseBackground>
          <button 
            onClick={onAddClick}
            className='flex items-center gap-2 cursor-pointer text-black font-semibold rounded-xl bg-white/80 h-10 px-5'>
          <IconPlus/> Add Application
          </button>
        </NoiseBackground>
      </div>
    </>
  )
}

export default Header
