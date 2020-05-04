import * as React from 'react';
import { cellPadding, stepTypeAppearance } from '../config';
import styled from 'styled-components';
import { DiatonicStepType } from '@musicenviro/base';

import { paletton } from './paletton';
import { RollContext } from '../DiatonicPianoRoll';

const Cell = styled.div`
	box-sizing: border-box;
	padding-left: ${cellPadding}px;
	padding-top: ${cellPadding * 0.5}px;
	padding-bottom: ${cellPadding * 0.5}px;
	height: 100%;
	width: ${(100 / 16).toFixed(2)}%;
	float: left;
	border-bottom: solid 1px;
`;

const CellContents = styled.div`
	height: 100%;
	width: 100%;
	border-radius: 10%;
`;

interface ILaneCellProps {
	laneIndex: number;
	cellIndex: number;
	depth: number; // depth in rhythm tree
	stepType: DiatonicStepType;
	activated: boolean;
	onChange: (active: boolean) => void;
}

const depthSuffix = [3, 3, 0, 2];

export const LaneCell: React.FunctionComponent<ILaneCellProps> = props => {
	const [clickedHere, setClickedHere] = React.useState<boolean>(false);
	const [showActivated, setShowActivated] = React.useState<boolean>(props.activated);

	React.useEffect(() => {
		setShowActivated(props.activated);
	}, [props.activated]);

	const { mouseDown, dragging, setDragOrigin, endDrag } = React.useContext(RollContext);

	return (
		<Cell>
			<CellContents
				style={{
					opacity: showActivated ? 1 : 0.25,
					backgroundColor:
						paletton[
							`color_${stepTypeAppearance[props.stepType].classStem}_${
								depthSuffix[props.depth]
							}`
						],
				}}
				onMouseDown={e => {
					setClickedHere(true);
					if (!props.activated) {
						setShowActivated(true);
					}
				}}
				onMouseEnter={e => {
					if (mouseDown) {
						setShowActivated(true);
					}
				}}
				onMouseUp={e => {
					setClickedHere(false);
					if (dragging) {
						endDrag(props.laneIndex, props.cellIndex);
					} else {
						if (props.activated) {
							setShowActivated(false);
							props.onChange(false);
						} else {
							props.onChange(true);
						}
					}
				}}
				onMouseLeave={e => {
					if (showActivated && !props.activated) setShowActivated(false);
					if (props.activated && clickedHere) {
						setShowActivated(false);
						setDragOrigin({ laneIndex: props.laneIndex, cellIndex: props.cellIndex });
					}
				}}

				// draggable={showActivated}
			></CellContents>
		</Cell>
	);
};
