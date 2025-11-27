import PropTypes from 'prop-types'
import Navigation from './Navigation'
import Footer from './Footer'
import './Layout.css'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navigation />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
