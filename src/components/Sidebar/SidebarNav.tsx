import { Stack } from '@chakra-ui/react'
import { RiDashboardLine, RiListCheck } from 'react-icons/ri'
import { BiFoodMenu, BiRestaurant, BiCategory } from 'react-icons/bi'
import { FaShoppingBasket } from 'react-icons/fa'
import { NavLink } from './NavLink'
import { NavSection } from './NavSection'

export function SidebarNav() {
  return (
    <Stack spacing="6">
      <NavLink icon={RiDashboardLine} href="/dashboard">
        Dashboard
      </NavLink>
      <NavSection title="Menu" icon={BiFoodMenu} activePath="/menu">
        <NavLink href="/menu">Week Menu</NavLink>
        <NavLink href="/menu/history">Menu History</NavLink>
      </NavSection>
      <NavSection title="Groceries" icon={FaShoppingBasket} activePath="/groceries">
        <NavLink href="/groceries">Grocery List</NavLink>
        <NavLink href="/groceries/add">Add Grocery</NavLink>
      </NavSection>
      <NavSection title="Dishes" icon={BiRestaurant} activePath="/dishes">
        <NavLink href="/dishes">Dish List</NavLink>
        <NavLink href="/dishes/add">Add Dish</NavLink>
        {/* <NavLink href="/dishes/upload">Add Multiple Dishes</NavLink> */}
      </NavSection>
      <NavSection title="Categories" icon={BiCategory} activePath="/categories">
        <NavLink href="/categories">Category List</NavLink>
        <NavLink href="/categories/add">Add Category</NavLink>
      </NavSection>
      <NavLink icon={RiListCheck} href="/shop-list">
        Shop List
      </NavLink>
    </Stack>
  )
}
