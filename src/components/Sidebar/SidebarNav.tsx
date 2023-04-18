import { Stack } from '@chakra-ui/react'
import { RiListCheck } from 'react-icons/ri'
import { BiFoodMenu, BiRestaurant, BiCategory } from 'react-icons/bi'
import { FaShoppingBasket } from 'react-icons/fa'
import { NavLink } from './NavLink'
import { NavSection } from './NavSection'
import { useContext, useEffect } from 'react'
import { AppContext } from '../../contexts/AppContext'
import { getUser } from '../../services/hooks/useUser'
import { localStorage } from '../../services/localstorage'

export function SidebarNav() {
  const { role, setRole } = useContext(AppContext)

  const fetchData = async () => {
    try {
      const response = await getUser(localStorage.get('user-id'))
      setRole(response.data.role)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Stack spacing="6">
      <NavSection title="Menyer" icon={BiFoodMenu} activePath="/menu">
        <NavLink href="/menu">Veckomeny</NavLink>
        <NavLink href="/menu/history">Meny historik</NavLink>
      </NavSection>
      <NavSection title="Ingredienser" icon={FaShoppingBasket} activePath="/groceries">
        <NavLink href="/groceries">Ingredienser</NavLink>
        {role === 'admin' && <NavLink href="/groceries/add">Lägg till ingredienser</NavLink>}
      </NavSection>
      <NavSection title="Maträtter" icon={BiRestaurant} activePath="/dishes">
        <NavLink href="/dishes">Maträtter</NavLink>
        {role === 'admin' && <NavLink href="/dishes/add">Lägg till maträtt</NavLink>}
        {/* <NavLink href="/dishes/upload">Add Multiple Dishes</NavLink> */}
      </NavSection>
      <NavSection title="Kategorier" icon={BiCategory} activePath="/categories">
        <NavLink href="/categories">Kategorier</NavLink>
        {role === 'admin' && <NavLink href="/categories/add">Lägg till kategori</NavLink>}
      </NavSection>
      <NavLink className="sidebar-text" icon={RiListCheck} href="/shop-list">
        Inköpslistor
      </NavLink>
    </Stack>
  )
}
