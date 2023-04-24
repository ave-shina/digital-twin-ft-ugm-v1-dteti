import * as React from 'react'
import ImageMapper from 'react-img-mapper'

function Map(props) {
  const { setCurrentScene } = props

  const [imgCoords, setImgCoords] = React.useState(0)

  const map = {
    name: 'my-map',
    areas: [
      {
        name: '7',
        shape: 'circle',
        coords: [150, 112, 5],
        preFillColor: 'red',
      },
      {
        name: '8',
        shape: 'circle',
        coords: [147, 138, 5],
        preFillColor: 'red',
      },
      {
        name: '9',
        shape: 'circle',
        coords: [143, 153, 5],
        preFillColor: 'red',
      },
      {
        name: '10',
        shape: 'circle',
        coords: [148, 196, 5],
        preFillColor: 'red',
      },
      {
        name: '5',
        shape: 'circle',
        coords: [163, 145, 5],
        preFillColor: 'red',
      },
      {
        name: '6',
        shape: 'circle',
        coords: [188, 103, 5],
        preFillColor: 'red',
      },
      {
        name: '12',
        shape: 'circle',
        coords: [185, 184, 5],
        preFillColor: 'red',
      },
      {
        name: '13',
        shape: 'circle',
        coords: [189, 223, 5],
        preFillColor: 'red',
      },
      {
        name: '0',
        shape: 'circle',
        coords: [221, 66, 5],
        preFillColor: 'red',
      },
      {
        name: '1',
        shape: 'circle',
        coords: [214, 91, 5],
        preFillColor: 'red',
      },
      {
        name: '2',
        shape: 'circle',
        coords: [222, 114, 5],
        preFillColor: 'red',
      },
      {
        name: '3',
        shape: 'circle',
        coords: [215, 129, 5],
        preFillColor: 'red',
      },
      {
        name: '4',
        shape: 'circle',
        coords: [212, 146, 5],
        preFillColor: 'red',
      },
      {
        name: '11',
        shape: 'circle',
        coords: [212, 171, 5],
        preFillColor: 'red',
      },
      {
        name: '15',
        shape: 'circle',
        coords: [231, 172, 5],
        preFillColor: 'red',
      },
      {
        name: '14',
        shape: 'circle',
        coords: [222, 208, 5],
        preFillColor: 'red',
      },
      {
        name: '31',
        shape: 'circle',
        coords: [270, 80, 5],
        preFillColor: 'red',
      },
      {
        name: '30',
        shape: 'circle',
        coords: [270, 118, 5],
        preFillColor: 'red',
      },
      {
        name: '16',
        shape: 'circle',
        coords: [269, 146, 5],
        preFillColor: 'red',
      },
      {
        name: '18',
        shape: 'circle',
        coords: [257, 172, 5],
        preFillColor: 'red',
      },
      {
        name: '17',
        shape: 'circle',
        coords: [274, 170, 5],
        preFillColor: 'red',
      },
      {
        name: '19',
        shape: 'circle',
        coords: [261, 205, 5],
        preFillColor: 'red',
      },
      {
        name: '20',
        shape: 'circle',
        coords: [304, 189, 5],
        preFillColor: 'red',
      },
      {
        name: '21',
        shape: 'circle',
        coords: [297, 224, 5],
        preFillColor: 'red',
      },
      {
        name: '29',
        shape: 'circle',
        coords: [300, 104, 5],
        preFillColor: 'red',
      },
      {
        name: '22',
        shape: 'circle',
        coords: [305, 147, 5],
        preFillColor: 'red',
      },
      {
        name: '28',
        shape: 'circle',
        coords: [340, 77, 5],
        preFillColor: 'red',
      },
      {
        name: '27',
        shape: 'circle',
        coords: [335, 112, 5],
        preFillColor: 'red',
      },
      {
        name: '26',
        shape: 'circle',
        coords: [340, 151, 5],
        preFillColor: 'red',
      },
      {
        name: '23',
        shape: 'circle',
        coords: [325, 161, 5],
        preFillColor: 'red',
      },
      {
        name: '25',
        shape: 'circle',
        coords: [340, 165, 5],
        preFillColor: 'red',
      },
      {
        name: '24',
        shape: 'circle',
        coords: [335, 201, 5],
        preFillColor: 'red',
      },
    ],
  }

  return (
    <>
      <div className='my-8 grid w-full grid-cols-1 space-y-4'>
        <div className='flex w-full flex-col items-center justify-center'>
          <div>{imgCoords}</div>
          <ImageMapper
            src={'https://fridayphotos.s3.eu-central-1.amazonaws.com/dot_map.png'}
            width={600}
            onImageClick={(evt) => setImgCoords('' + evt.pageX + ', ' + evt.pageY)}
            onClick={(area) => setCurrentScene(parseInt(area.name))}
            map={map}
            // parentWidth={800}
            // responsive={true}
          />
        </div>
      </div>
    </>
  )
}

export default Map
