import GameModule from './game';
import GameController from './game.controller';

import { difficultyMap } from './game.constants.js';

describe('Game', () => {

    let component, $componentController, $stateParams, $timeout, ThemesModel;

    beforeEach(() => {
        window.module(GameModule.name);

        window.module($provide => {
            $provide.value('ThemesModel', {
                getShuffledThemeItems: (theme = 'pokemon', levelSeed = 2) => {
                    return {
                        then: () => { }
                    };
                }
            });
        });
    });


    beforeEach(inject((_$componentController_, _$timeout_, _ThemesModel_) => {
        $componentController = _$componentController_;
        $timeout = _$timeout_;
        ThemesModel = _ThemesModel_;
    }));

    describe('Controller', () => {


        beforeEach(() => {
            $stateParams = { difficulty: 'easy', theme: 'javascript' }

            spyOn(ThemesModel, 'getShuffledThemeItems').and.callThrough();

            component = $componentController('game', {
                $stateParams,
                $timeout,
                ThemesModel
            });
        })

        it('has dependencies that are defined', () => {
            expect(component.$stateParams).toBeDefined();
            expect(component.$timeout).toBeDefined();
            expect(component.ThemesModel).toBeDefined();
        });

        describe('instantiation state', () => {
            it('has active and complete indices set to empty', () => {
                expect(component.indices).toBeDefined();
                expect(component.indices.active).toBeDefined();
                expect(component.indices.complete).toBeDefined();

                expect(component.indices.active.length).toEqual(0);
                expect(component.indices.complete.length).toEqual(0);
            });

            it('has flags that are defined and set to defaults', () => {
                expect(component.flags).toBeDefined();
                expect(component.flags.countdown).toBeDefined();
                expect(component.flags.gameFinished).toBeDefined();
                expect(component.flags.verifyingMove).toBeDefined();

                expect(component.flags.countdown).toEqual(false);
                expect(component.flags.gameFinished).toEqual(false);
                expect(component.flags.verifyingMove).toEqual(false);
            });

            it('has an empty cells array', () => {
                expect(component.themeItems).toBeDefined();
                expect(component.themeItems.length).toEqual(0);
            });

            // checking only for easy level, maybe room for more?!
            it('has difficulty info', () => {
                expect(component.difficultyMap).toBeDefined();
                expect(component.difficultyMap.seed).toEqual(difficultyMap['easy'].seed);
                expect(component.difficultyMap.uniquePairs).toEqual(difficultyMap['easy'].uniquePairs);
                expect(component.difficultyMap.gridOpenTime).toEqual(difficultyMap['easy'].gridOpenTime);
                expect(component.difficultyMap.timerMaxValue).toEqual(difficultyMap['easy'].timerMaxValue);
                expect(component.difficultyMap.difficulty).toEqual('easy');
            });

        });

        describe('onInit', () => {

        })

    });

});
