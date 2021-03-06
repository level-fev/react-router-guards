import { PokemonMove, MoveLearnType, SerializedMove, SerializedMoves } from 'types';
import { getName } from 'utils';

const getMoves = (moves: PokemonMove[]): SerializedMoves => {
  const movesMap: Record<MoveLearnType, SerializedMove[]> = Object.values(MoveLearnType).reduce(
    (acc, key) => ({ ...acc, [key]: [] }),
    {},
  );

  moves.forEach(({ move, version_group_details }) => {
    const { level_learned_at, move_learn_method } = version_group_details[0];
    const method = move_learn_method.name;
    if (movesMap[method]) {
      movesMap[method].push({
        name: getName(move.name),
        level: level_learned_at,
      });
    }
  });

  const sortByMove = (a: SerializedMove, b: SerializedMove) => a.name.localeCompare(b.name);

  return {
    [MoveLearnType.Egg]: movesMap[MoveLearnType.Egg].sort(sortByMove),
    [MoveLearnType.LevelUp]: movesMap[MoveLearnType.LevelUp].sort((a, b) => {
      const levelDiff = a.level - b.level;
      if (levelDiff === 0) {
        return sortByMove(a, b);
      }
      return levelDiff;
    }),
    [MoveLearnType.Machine]: movesMap[MoveLearnType.Machine].sort(sortByMove),
    [MoveLearnType.Tutor]: movesMap[MoveLearnType.Tutor].sort(sortByMove),
  };
};

export default getMoves;
