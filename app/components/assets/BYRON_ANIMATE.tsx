import { useEffect, useRef } from 'react';
import { animate, createScope, createDraggable } from 'animejs';

interface ByronAnimateProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function ByronAnimate({ 
  className = "", 
  width = "auto", 
  height = 32 
}: ByronAnimateProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      // Get the total length of the path
      const pathLength = pathRef.current.getTotalLength();
      
      // Set initial state
      pathRef.current.style.strokeDasharray = `${pathLength}`;
      pathRef.current.style.strokeDashoffset = `${pathLength}`;
      pathRef.current.style.fill = 'none';
      pathRef.current.style.stroke = '#ceff00';
      pathRef.current.style.strokeWidth = '1';
      pathRef.current.style.strokeLinecap = 'round';
      pathRef.current.style.filter = 'drop-shadow(0 0 2px #ceff00)';

      // Animate the path drawing
      animate("animate-path",{
        targets: "animate-path",
        strokeDashoffset: [pathLength, 0],
        duration: 3000,
        easing: 'easeInOutSine',
        complete: () => {
          // After drawing is complete, fill the path
          if (pathRef.current) {
            animate("animate-path",{
              targets: "animate-path",
              fill: '#ceff00',
              duration: 500,
              easing: 'easeInOutSine'
            });
          }
        }
      });
    }
  }, []);

  return (
    <svg
      className={className + " animate-path"}
      width={width}
      height={height}
      viewBox="0 0 77.258339 20.515625"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={pathRef}
        d="M 10.387483,-2.6475907e-6 9.3317333,1.1038074 h 0.9580817 c 0.436562,0 4.262272,0.0684 4.262272,4.05298 0,4.08276 -4.127703,4.11665 -4.302063,4.11965 l -0.03721,1.0557496 c 0.17727,0.0132 4.33927,0.37039 4.33927,4.20129 0,3.74916 -4.053582,4.18821 -4.402832,4.21731 l -9.0909187,-0.016 V 9.2816174 L 2.5316632e-7,10.339957 v 9.54929 H 10.189043 l 0.0186,-0.0403 c 1.870604,-0.13758 5.402771,-1.45516 5.402771,-5.31544 0,-2.54529 -1.516352,-3.95729 -3.074748,-4.6663796 1.561042,-0.64557 3.074748,-2.04166 3.074748,-4.74596 0,-2.65113 -1.428729,-3.90422 -2.624646,-4.49689005 -1.116277,-0.55561 -2.238458,-0.61365 -2.598291,-0.624249997591 z M 53.181255,0.04499735 V 1.1033274 h 4.45296 l 8.82943,8.9984196 -8.74468,8.99325 h -9.2289 l -8.093561,-8.46667 h 3.354839 c 0.05027,0 5.043102,-0.15873 5.043102,-5.4027696 0,-1.58988 -0.47369,-2.88127 -1.407672,-3.79408 -1.50548,-1.47105005 -3.65112,-1.38596005 -3.73052,-1.38596005 H 34.046504 L 24.773168,9.2527074 15.562878,0.04551735 h -1.492416 l 9.950814,9.92911005 -0.03411,0.0109 10.180774,10.1683696 h 1.503267 L 25.521439,10.001547 34.480582,1.1033774 h 9.188587 c 0.02116,0 1.78904,-0.0531 2.97966,1.11105 0.71967,0.70406 1.08727,1.6936 1.08727,2.98741 0,4.191 -3.83906,4.36873 -3.99252,4.36873 H 37.920166 L 48.037905,20.153897 h 10.13064 l 9.04596,-9.35602 10.04383,9.71775 V 0.30962735 h -1.05833 V 18.012427 L 67.529735,9.6284374 58.076045,0.04504735 Z M 3.2531663e-6,0.04551735 V 8.2233074 L 8.2733993,0.04551735 Z"
      />
    </svg>
  );
}