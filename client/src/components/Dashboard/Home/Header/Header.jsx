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
            className='flex items-center gap-1 md:gap-2 cursor-pointer text-black font-semibold rounded-xl bg-white/80 h-10 px-3 md:px-5 text-sm md:text-base whitespace-nowrap'>
          <IconPlus className="w-4 h-4 md:w-5 md:h-5" /> Add Application
          </button>
        </NoiseBackground>
      </div>
    </>
  )
}

export default Header
