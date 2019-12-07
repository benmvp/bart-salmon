import React from 'react'
import range from 'lodash/range'

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Slider from '@material-ui/core/Slider';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

interface FormElementMetaDataProps {
  name: string;
  label: string;
}

interface FormElementShellProps extends FormElementMetaDataProps {
  children: React.ReactNode;
}

const FormElementShell = ({ name, label, children }: FormElementShellProps) => (
  <Box mb={5}>
    <FormControl component="fieldset">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {children}
    </FormControl>
  </Box>
)

type SetValue<T> = (value: T) => void

interface SettingProps<T> {
  value: T;
  setValue: SetValue<T>;
}

const MARKS = [
  {
    value: -1,
    label: 'Very Risky',
    blurb: 'The doors of the returning train will likely be closing as your backward train arrives at the station. You will need to sprint across the platform!'
  },
  {
    value: 0,
    label: 'Risky',
    blurb: 'The returning train will likely be arriving as your backwards train arrives at the station. You may have to sprint across the platform.'
  },
  {
    value: 1,
    label: 'Safe',
    blurb: 'The returning train will likely arrive within a minute after you exit your backwards train. You should have time to wait on the platform.'
  },
  {
    value: 2,
    label: 'Very Safe',
    blurb: 'The returning train will likely arrive within a few minutes after you exit your backwards train. You should have plenty of time to wait on the platform.'
  },
]

const riskinessFactorBlurb = (value: number) => {
  const foundMark = MARKS.find((mark) => mark.value === value)

  return foundMark ? foundMark.blurb : ''
}

const RiskinessFactor = ({value, setValue}: SettingProps<number>) => {
  return (
    <FormElementShell name="riskinessFactor" label="Riskiness Factor">
      <Box mx={5}>
        <Slider
          name="riskinessFactor"
          value={value}
          min={MARKS[0].value}
          max={MARKS[MARKS.length - 1].value}
          step={1}
          marks={MARKS}
          onChange={(e, value) => setValue(value as number)}
        />
      </Box>
      <Typography variant="body2">
        {riskinessFactorBlurb(value)}
      </Typography>
    </FormElementShell>
  )
}

interface NumSettingProps<T> extends SettingProps<T>, FormElementMetaDataProps {
}

const NumSetting = ({ value, setValue, name, label }: NumSettingProps<number>) => {
  const radios = range(6).map((num) => (
    <FormControlLabel
      key={num}
      value={num + 1}
      control={<Radio color="primary" />}
      label={`${num + 1}`}
      labelPlacement="end"
    />
  ))

  return (
    <FormElementShell name={name} label={label}>
      <RadioGroup
        name="numSalmonRoutes"
        value={value}
        row
        onChange={(e, value) => setValue(Number.parseInt(value))}
      >
        {radios}
      </RadioGroup>
    </FormElementShell>
  )
}

const NumSalmonRoutes = ({ value, setValue }: SettingProps<number>) => (
  <NumSetting
    name="numSalmonRoutes"
    label="Max number of salmon routes"
    value={value}
    setValue={setValue}
  />
)

const NumArrivals = ({ value, setValue }: SettingProps<number>) => (
  <NumSetting
    name="numArrivals"
    label="Max number of train arrivals"
    value={value}
    setValue={setValue}
  />
)

interface Props {
  path: string;

  riskinessFactor: number;
  setRiskinessFactor: SetValue<number>;
  numSalmonRoutes: number;
  setNumSalmonRoutes: SetValue<number>;
  numArrivals: number;
  setNumArrivals: SetValue<number>;
}

const SettingsPage = ({
  riskinessFactor,
  setRiskinessFactor,
  numSalmonRoutes,
  setNumSalmonRoutes,
  numArrivals,
  setNumArrivals,
}: Props) => {

  return (
    <Box p={2}>
      <NumArrivals value={numArrivals} setValue={setNumArrivals} />
      <RiskinessFactor value={riskinessFactor} setValue={setRiskinessFactor} />
      <NumSalmonRoutes value={numSalmonRoutes} setValue={setNumSalmonRoutes} />
    </Box>
  )
}

export default SettingsPage
