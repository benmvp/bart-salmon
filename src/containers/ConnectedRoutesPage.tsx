import {connect} from 'react-redux'
import {
  setOrigin, 
  setDestination, 
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
  numArrivals,
  isFetching,
}: AppState) => ({
  origin,
  destination,
  numSalmonRoutes,
  salmonRoutes,
  arrivals,
  numArrivals,
  isDisabled: isFetching,
})

const _mapDispatchToProps = {
  setOrigin,
  setDestination,
  getSalmonInfo,
}

export default connect(_mapStateToProps, _mapDispatchToProps)(RoutesPage)
