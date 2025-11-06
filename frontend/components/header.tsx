import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

const Header = () => {
  return (
    <div className='w-full bg-[#5B8FB9] text-center text-4xl relative border-2 border-sidebar-border border-t-0 border-l-0 h-20'>
      <SidebarTrigger className='absolute left-0' />
      <div className='py-4'>G-Scores</div>
    </div>
  );
};

export default Header;
