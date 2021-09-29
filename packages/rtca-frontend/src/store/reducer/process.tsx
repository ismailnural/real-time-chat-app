export const Reducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case 'PROCESS':
      return { ...action.payload }
    default:
      return state
  }
}
