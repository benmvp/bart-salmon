import React from 'react'
import SvgIcon, {SvgIconProps} from '@material-ui/core/SvgIcon'

const SleepingEmoji = (svgProps: SvgIconProps) => (
  <SvgIcon
    {...svgProps}
    component={() => (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        {...svgProps}
      >
        <circle style={{fill:'#FDDF6D'}} cx="216.403" cy="259.198" r="216.403"/>
        <path style={{fill: '#FCC56B'}} d="M262.775,443.654c-119.516,0-216.402-96.886-216.402-216.402c0-63.853,27.661-121.238,71.647-160.848 C47.962,102.225,0,175.11,0,259.198C0,378.714,96.886,475.6,216.402,475.6c55.663,0,106.411-21.023,144.755-55.553 C331.64,435.139,298.203,443.654,262.775,443.654z"/>
        <g>
          <path style={{fill:'#7F184C'}} d="M185.688,286.109c-21.41,0-40.755-5.478-51.744-14.655c-3.732-3.116-4.23-8.669-1.114-12.4
            c3.116-3.73,8.669-4.232,12.4-1.114c7.684,6.417,23.564,10.563,40.458,10.563c16.487,0,32.586-4.225,41.01-10.761
            c3.841-2.98,9.37-2.282,12.352,1.559c2.98,3.841,2.282,9.372-1.559,12.352C225.824,280.703,206.457,286.109,185.688,286.109z"/>
          <path style={{fill:'#7F184C'}} d="M338.393,286.109c-21.41,0-40.753-5.478-51.743-14.655c-3.732-3.116-4.23-8.669-1.114-12.4
            c3.115-3.73,8.667-4.232,12.4-1.114c7.684,6.417,23.564,10.563,40.456,10.563c16.488,0,32.587-4.225,41.012-10.761
            c3.841-2.98,9.372-2.282,12.352,1.559c2.98,3.841,2.282,9.372-1.559,12.352C378.53,280.703,359.163,286.109,338.393,286.109z"/>
          <circle style={{fill:'#7F184C'}} cx="259.963" cy="384.044" r="36.092"/>
        </g>
        <g>
          <path style={{fill:'#0DAED3'}} d="M261.385,226.355c-2.119,0-4.213-0.763-5.86-2.231c-2.652-2.363-3.624-6.089-2.464-9.446
            l9.73-28.171l-18.598,9.868c-4.295,2.281-9.625,0.644-11.904-3.649c-2.278-4.295-0.646-9.624,3.649-11.904l38.344-20.347
            c3.194-1.693,7.102-1.264,9.851,1.088c2.748,2.351,3.778,6.144,2.598,9.562l-10.143,29.364l15.229-7.308
            c4.381-2.101,9.642-0.257,11.746,4.128c2.103,4.383,0.256,9.643-4.128,11.746l-34.245,16.433
            C263.978,226.071,262.678,226.355,261.385,226.355z"/>
          <path style={{fill:'#0DAED3'}} d="M347.506,187.153c-2.101,0-4.18-0.751-5.822-2.199c-2.679-2.361-3.667-6.104-2.501-9.478
            l16.881-48.874l-34.7,18.412c-4.295,2.28-9.625,0.643-11.904-3.649c-2.278-4.295-0.646-9.624,3.649-11.904l54.445-28.889
            c3.195-1.693,7.102-1.264,9.851,1.088c2.748,2.351,3.779,6.144,2.598,9.562l-17.179,49.74l36.941-18.248
            c4.361-2.153,9.638-0.365,11.792,3.994c2.153,4.36,0.365,9.638-3.994,11.792l-56.158,27.741
            C350.165,186.854,348.83,187.153,347.506,187.153z"/>
          <path style={{fill:'#0DAED3'}} d="M441.644,142.617c-2.119,0-4.213-0.763-5.86-2.231c-2.652-2.364-3.624-6.09-2.464-9.446
            l23.309-67.486l-49.177,26.093c-4.296,2.28-9.625,0.644-11.904-3.649c-2.278-4.295-0.644-9.624,3.649-11.904l68.922-36.57
            c3.195-1.693,7.102-1.264,9.851,1.088c2.749,2.351,3.778,6.144,2.598,9.562l-23.721,68.677l42.535-20.412
            c4.379-2.103,9.642-0.257,11.746,4.128c2.103,4.383,0.256,9.643-4.128,11.746l-61.552,29.538
            C444.237,142.332,442.936,142.617,441.644,142.617z"/>
        </g>
        <ellipse transform="matrix(0.2723 -0.9622 0.9622 0.2723 87.0308 321.3217)" style={{fill:'#FCEB88'}} cx="255.952" cy="103.122" rx="25.237" ry="45.191"/>
      </svg>
    )}
  />
)

export default SleepingEmoji