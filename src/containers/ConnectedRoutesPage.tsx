import {connect} from 'react-redux'
import {
  setStations,
  getSalmonInfo,
} from '../store/actions'
import {AppState} from '../store/reducers'
import RoutesPage from '../components/RoutesPage'

const _mapStateToProps = ({
  origin,
  destination,
  numSalmonRoutes,
  salmonRoutes,
  arrivals,
  isFetching,
  lastUpdated,
  numArrivals,
}: AppState) => ({
  origin,
  destination,
  numSalmonRoutes,
  salmonRoutes,
  arrivals,
  lastUpdated,
  numArrivals,
  isDisabled: isFetching,
})

const _mapDispatchToProps = {
  setStations,
  getSalmonInfo,
}

export default connect(_mapStateToProps, _mapDispatchToProps)(RoutesPage)
