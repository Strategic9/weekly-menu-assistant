import { Stack } from '@chakra-ui/react'
import { RiDashboardLine, RiListCheck } from 'react-icons/ri'
import { BiFoodMenu, BiRestaurant, BiCategory } from 'react-icons/bi'
import { FaShoppingBasket } from 'react-icons/fa'
import { NavLink } from './NavLink'
import { NavSection } from './NavSection'

export function SidebarNav() {
  return (
    <Stack spacing="6">
      <NavLink className="sidebar-text" icon={RiDashboardLine} href="/dashboard">
        Instrumentpanel
      </NavLink>
      <NavSection title="Menyer" icon={BiFoodMenu} activePath="/menu">
        <NavLink href="/menu">Veckomeny</NavLink>
        <NavLink href="/menu/history">Meny historik</NavLink>
      </NavSection>
      <NavSection title="Ingredienser" icon={FaShoppingBasket} activePath="/groceries">
        <NavLink href="/groceries">Ingredienser</NavLink>
        <NavLink href="/groceries/add">Lägg till ingredienser</NavLink>
      </NavSection>
      <NavSection title="Maträtter" icon={BiRestaurant} activePath="/dishes">
        <NavLink href="/dishes">Maträtter</NavLink>
        <NavLink href="/dishes/add">Lägg till maträtt</NavLink>
        {/* <NavLink href="/dishes/upload">Add Multiple Dishes</NavLink> */}
      </NavSection>
      <NavSection title="Kategorier" icon={BiCategory} activePath="/categories">
        <NavLink href="/categories">Kategorier</NavLink>
        <NavLink href="/categories/add">Lägg till kategori</NavLink>
      </NavSection>
      <NavSection title="Admin" icon={BiCategory} activePath="/admin">
        <NavLink href="/admin">Admin</NavLink>
      </NavSection>
      <NavLink className="sidebar-text" icon={RiListCheck} href="/shop-list">
        Inköpslistor
      </NavLink>
    </Stack>
  )
}
