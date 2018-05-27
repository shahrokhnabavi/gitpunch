import React from 'react'
import { renderToString } from 'react-dom/server'
import Root from './containers/Root'
import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider, createGenerateClassName } from 'material-ui/styles'
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import createTheme from './theme/createTheme'
import * as api from './services/api'
import * as cookieSvc from './services/cookie'
import { StaticRouter } from 'react-router-dom'

export async function renderToStrings (serverPort, cookie, url) {
  api.setBase({
    url: `http://localhost:${serverPort}`,
    opts: { headers: { cookie } }
  })
  cookieSvc.setSource(cookie)

  const store = configureStore()
  const sagaDone = store.runSaga(rootSaga).done
  store.close()
  await sagaDone
  const sheetsRegistry = new SheetsRegistry()
  const theme = createTheme()
  const generateClassName = createGenerateClassName()

  const routerContext = {}
  const html = renderToString(
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <StaticRouter location={url} context={routerContext}>
        <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
          <Root store={store} />
        </MuiThemeProvider>
      </StaticRouter>
    </JssProvider>
  )
  const css = sheetsRegistry.toString()
  const state = JSON.stringify(store.getState())

  return { html, css, state }
}
