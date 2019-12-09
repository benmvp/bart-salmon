import {connect} from 'react-redux'
import {
  setRiskinessFactor,
  setNumSalmonRoutes,
  setNumArrivals,
} from '../store/actions'
import {AppState} from '../store/reducers'
import SettingsPage from '../components/SettingsPage'

const _mapStateToProps = ({
  riskinessFactor,
  numSalmonRoutes,
  numArrivals,
}: AppState) => ({
  riskinessFactor,
  numSalmonRoutes,
  numArrivals,
})

const _mapDispatchToProps = {
  setRiskinessFactor,
  setNumSalmonRoutes,
  setNumArrivals,
}

export default connect(_mapStateToProps, _mapDispatchToProps)(SettingsPage)
