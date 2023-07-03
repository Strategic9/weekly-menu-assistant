export function arrayMove<T>(arr: Array<T>, old_index: number, new_index: number) {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr // for testing
}

export const organizeByDate = (menu) => {
  return menu.menu.dishes.sort(
    (a, b) => new Date(a.selectionDate).getTime() - new Date(b.selectionDate).getTime()
  )
}

export function addLeadingZero(num: number): string {
  let numStr = num.toString()
  if (num < 10) {
    numStr = '0' + numStr
  }
  return numStr
}

export function getDays(from: Date, to: Date) {
  const diffTime = to.getTime() - from.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const daysList: Date[] = []
  for (let i = 0; i <= diffDays; i++) {
    const day = addDays(from, i)
    daysList.push(day)
  }
  return daysList
}

export function addDays(date: Date, days: number) {
  const referenceDay = new Date(date)
  return new Date(referenceDay.setDate(date.getDate() + days))
}

export const setDate = (data) =>
  new Date(data.createdAt).toLocaleDateString('sv', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

export const getDayName = (dateStr, locale) =>
  new Date(dateStr).toLocaleDateString(locale, { weekday: 'long' })

export const getMonthName = (dateStr, locale) =>
  `${new Date(dateStr).toLocaleDateString(locale, {
    month: 'long'
  })}, ${new Date(dateStr).getDate()}`

export const convertDateToString = (date) => {
  return new Date(date).toISOString().split('T')[0]
}

export const longDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export const placeholderImage =
  'https://images.unsplash.com/photo-1584255014406-2a68ea38e48c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGZvcmt8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'

/**
 * The function `getDishesIds` takes an array of dishes and returns an array of
 * objects containing the dish id and selection date, excluding dishes with ids that include the word 'empty'.
 * @param dishes - The `dishes` parameter is an array of objects.
 */
export const getDishesIds = (dishes: []) => {
  const dishesIds = []
  dishes.forEach(
    (d: any) =>
      !d.dish.id.includes('empty') &&
      dishesIds.push({
        id: d.dish.id,
        selectionDate: d.selectionDate
      })
  )
  return dishesIds
}
