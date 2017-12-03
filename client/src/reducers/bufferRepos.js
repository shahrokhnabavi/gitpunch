export function bufferRepos (state = [], action) {
  switch (action.type) {
    case 'RECEIVE_LOGIN':
    case 'RECEIVE_PROFILE':
    case 'RECEIVE_REGISTER':
      return []
    case 'ADD_REPO_TO_BUFFER':
      return state.includes(action.repo) ? state : state.concat(action.repo)
    case 'REMOVE_REPO_FROM_BUFFER':
      return state.includes(action.repo) ? state.filter(r => r !== action.repo) : state
    default:
      return state
  }
}