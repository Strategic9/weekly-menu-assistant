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
  new Date(data.createdAt).toLocaleDateString('se', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

export const getDayName = (dateStr, locale) =>
  new Date(dateStr).toLocaleDateString(locale, { weekday: 'long' }).slice(0, -3)

export const getMonthName = (dateStr, locale) =>
  `${new Date(dateStr).toLocaleDateString(locale, {
    month: 'long'
  })}, ${new Date(dateStr).getDate()}`

export const convertDateToString = (date) => {
  return new Date(date).toISOString().split('T')[0]
}
