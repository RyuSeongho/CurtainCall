import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { currentRoundState, sortedImageDataState, totalRoundsState } from "../../atom/atom";
import RoundContainer from "./RoundContainer";

const Tournament = ({ onRoundsReady, onGroupChange }) => {
    const sortedImages = useRecoilValue(sortedImageDataState);
    const [currentRound, setCurrentRound] = useRecoilState(currentRoundState);
    const [selectedImagesByGroup, setSelectedImagesByGroup] = useState({});
    const [groups, setGroups] = useState([]);
    const [totalRounds, setTotalRounds] = useRecoilState(totalRoundsState);
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [subGroupIndex, setSubGroupIndex] = useState(0);

    useEffect(() => {
        if (Object.keys(sortedImages).length > 0) {
            const newGroups = Object.entries(sortedImages).map(([group_id, images]) => ({
                group_id,
                images: images.map(src => ({ src }))
            }));
            const adjustedGroups = adjustGroups(newGroups);
            setGroups(adjustedGroups);
            setTotalRounds(adjustedGroups.map(group => Math.ceil(group.images.length / 4)));
            onGroupChange(adjustedGroups[0], 1, Math.ceil(adjustedGroups[0].images.length / 4));  // 초기 그룹 정보 설정
        }
    }, [sortedImages]);

    const adjustGroups = (groups) => {
        return groups.map(group => {
            const length = group.images.length;
            const remainder = length % 4;
            if (remainder !== 0) {
                const fillers = Array(4 - remainder).fill({
                    src: '../dummy.png',
                    group_id: group.group_id,
                    isDummy: true
                });
                return { ...group, images: [...group.images, ...fillers] };
            }
            return group;
        });
    };

    const handleImageSelect = (image) => {
        const currentGroup = groups[activeGroupIndex];
        const updatedSelectedImages = {
            ...selectedImagesByGroup,
            [currentGroup.group_id]: [...(selectedImagesByGroup[currentGroup.group_id] || []), image]
        };

        setSelectedImagesByGroup(updatedSelectedImages);

        const numSubGroups = Math.ceil(currentGroup.images.length / 4);
        const newSubGroupIndex = (subGroupIndex + 1) % numSubGroups;

        if (newSubGroupIndex === 0) {  // 현재 그룹의 모든 소그룹 선택 완료
            const remainingImages = updatedSelectedImages[currentGroup.group_id].filter(img => !img.isDummy);

            if (remainingImages.length > 1) {  // 선택된 이미지가 2개 이상인 경우
                const newGroup = { group_id: currentGroup.group_id, images: remainingImages };
                const adjustedNewGroups = adjustGroups([newGroup]);
                setGroups(groups.map((group, index) =>
                    index === activeGroupIndex ? adjustedNewGroups[0] : group
                ));
                setSelectedImagesByGroup({
                    ...updatedSelectedImages,
                    [currentGroup.group_id]: []  // 새 라운드를 위해 선택된 이미지 초기화
                });
                setSubGroupIndex(0);
                onGroupChange(currentGroup, 1, Math.ceil(adjustedNewGroups[0].images.length / 4));
            } else {  // 최종 선택된 이미지가 하나인 경우
                if (activeGroupIndex < groups.length - 1) {
                    setActiveGroupIndex(activeGroupIndex + 1);  // 다음 그룹으로 이동
                    setSubGroupIndex(0);
                    onGroupChange(groups[activeGroupIndex + 1], 1, Math.ceil(groups[activeGroupIndex + 1].images.length / 4));
                } else {
                    onRoundsReady(Object.values(updatedSelectedImages).flat());  // 모든 그룹의 최종 선택 완료
                }
            }
        } else {
            setSubGroupIndex(newSubGroupIndex);
            onGroupChange(currentGroup, newSubGroupIndex + 1, numSubGroups);
        }
    };

    return (
        <div>
            {groups.length > 0 && (
                <RoundContainer
                    key={groups[activeGroupIndex].group_id * 100 + subGroupIndex}
                    group={{
                        ...groups[activeGroupIndex],
                        images: groups[activeGroupIndex].images.slice(subGroupIndex * 4, (subGroupIndex + 1) * 4)
                    }}
                    onImageSelect={handleImageSelect}
                />
            )}
        </div>
    );
};

export default Tournament;
