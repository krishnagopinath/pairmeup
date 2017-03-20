import GameModule from './game';
import CommonModule from '../../common/common';

import GameController from './game.controller';


import { difficultyMap } from './game.constants.js';

describe('Game', () => {
    const theme = 'javascript';
    const levelSeed = 2;
    const themeAPI = `/api/themes/${theme}/${levelSeed}`;
    const themeAPIResponse = { data: [{ "icon": "sails.png", "name": "sails", "id": "ab51d7990b44a5a3de55f3fa77bbac63b55af0fd" }, { "icon": "bower.png", "name": "bower", "id": "7866bd144c2fec22b8d82a18801c054bc5647f80" }] };

    let component, $componentController, $stateParams, $timeout, $httpBackend, $q, ThemesModel;

    beforeEach(() => {
        window.module(GameModule.name);
        window.module(CommonModule.name);
    });


    beforeEach(inject((_$componentController_, _$httpBackend_, _$timeout_, _ThemesModel_) => {
        $componentController = _$componentController_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        ThemesModel = _ThemesModel_;
    }));

    describe('Controller', () => {


        beforeEach(() => {
            $stateParams = { difficulty: 'easy', theme: 'javascript' }
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

            beforeEach(() => {
                spyOn(ThemesModel, 'getShuffledThemeItems').and.callThrough();

                spyOn(component, 'getThemeItems').and.callThrough();
                spyOn(component, 'computeThemeCells').and.callThrough();
                spyOn(component, 'bindToView').and.callThrough();
                spyOn(component, 'showAndHideGrid').and.callThrough();
                spyOn(component, 'showProgressBar').and.callThrough();
            });

            beforeEach(() => {
                $httpBackend.whenGET(themeAPI).respond(200, themeAPIResponse);
            });

            describe('init chain', () => {

                it('should get themeItems based on theme name and the pairs needed', () => {

                    let result = null;


                    component.getThemeItems(theme, levelSeed).then((d) => result = d.data);
                    $httpBackend.flush();

                    expect(ThemesModel.getShuffledThemeItems).toHaveBeenCalledWith(theme, levelSeed);
                    expect(result.length).toEqual(themeAPIResponse.data.length);
                    expect(result).toEqual(themeAPIResponse.data);

                });

                describe('shuffling stage', () => {
                    let themeItems;

                    beforeEach((done) => {
                        component.getThemeItems(theme, levelSeed).then((d) => {
                            themeItems = d.data;
                            done();
                        });
                        $httpBackend.flush();
                    });

                    it('should have gotten the theme items first', () => {
                        expect(component.getThemeItems).toHaveBeenCalledWith(theme, levelSeed);
                        expect(themeItems).toBeDefined();
                    });

                    // TODO write a better shuffling routine that is predictable and reproducible and also, a better test
                    it('should compute a shuffled list of cells based on the themeItems recieved', () => {
                        let result = component.computeThemeCells(themeItems);
                        expect(result.length).toEqual(Math.pow(levelSeed, 2));
                    });

                    describe('bind-to-view stage', () => {
                        let shuffledThemeItems;

                        beforeEach(() => {
                            shuffledThemeItems = component.computeThemeCells(themeItems);
                        });

                        it('should have gotten the shuffled theme items first', () => {
                            expect(component.getThemeItems).toHaveBeenCalled();
                            expect(shuffledThemeItems).toBeDefined();
                        });

                        it('should bind the themeItems to the scope (aka `this`)', () => {
                            expect(component.themeItems.length).toEqual(0);

                            component.bindToView(shuffledThemeItems);

                            expect(component.themeItems).toEqual(shuffledThemeItems);
                        });
                    });

                    // ... and the chain goes on!
                });
            });
        });

    });

});
