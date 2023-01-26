import React from 'react';

import FutureHeader from '../common/futureHeader/FutureHeader';

import './roleHelp.scss';

export default function Help({settings}) {
    return (
        <div className="FlexColumn" id="HelpContent">
            <FutureHeader headerType="h1" text={<><span className="Resistance">Resistance</span> Roles</>} />
            <ul>
                <li>
                    <span className="Resistance">Merlin</span>: Sees <span className="Spy">spies</span> (except <span className="Spy">Mordred</span>) and <span className="Resistance">Puck</span>; Can be assassinated
                </li>
                <li>
                    <span className="Resistance">Arthur</span>: Sees <span className="Resistance">resistance</span> roles present; Can be assassinated
                </li>
                <li>
                    <span className="Resistance">Tristan</span>: Sees <span className="Resistance">Iseult</span>; Can be assassinated with <span className="Resistance">Iseult</span>
                </li>
                <li>
                    <span className="Resistance">Iseult</span>: Sees <span className="Resistance">Tristan</span>; Can be assassinated with <span className="Resistance">Tristan</span>
                </li>
                {settings.ector &&
                    <li>
                        (8+) <span className="Resistance">Ector</span>: Known by all <span className="Resistance">Resistance</span> members; Can beassassinated
                    </li>
                }
                <li>
                    <span className="Resistance">Percival</span>: Sees <span className="Resistance">Merlin</span> and <span className="Spy">Morgana</span>
                </li>
                <li>
                    <span className="Resistance">Lancelot</span>: May play reverse cards
                </li>
                <li>
                    <span className="Resistance">Uther</span>: Sees a random <span className="Resistance">resistance</span> player
                </li>
                <li>
                    (7+) <span className="Resistance">Guinevere</span>: Sees <span className="Resistance">Lancelot</span> and <span className="Spy">Maelagant</span>
                </li>
                <li>
                    <span className="Resistance">Jester</span>: Only wins if assassinated; Sees present assassinable roles
                </li>
                <li>
                    (7+) <span className="Resistance">Puck</span>: Only wins if <span className="Resistance">Resistance</span> wins after 5 rounds; May play fail cards
                </li>
                <li>
                    <span className="Resistance">Galahad</span>: Sees <span className="Resistance">Arthur</span>
                </li>
                {settings.gaheris &&
                    <li>
                        (7+) <span className="Resistance">Gaheris</span>: Can bind a player on a mission to the <span className="Resistance">Resistance</span>
                    </li>
                }
                {settings.geraint &&
                    <li>
                        (7+) <span className="Resistance">Geraint</span>: Can protect a player on a mission from a <span className="Spy">spy</span> bind
                    </li>
                }
                <li>
                    (8+) <span className="Resistance">Bedivere</span>: Sees <span className="Spy">spy</span> roles
                </li>
                {settings.kay &&
                    <li>
                        (8+) <span className="Resistance">Kay</span>: If <span className="Spy">Spies</span> win 3 rounds, can redeem <span className="Resistance">Resistance</span> by naming all <span className="Spy">Spies</span> correctly
                    </li>
                }
                {settings.lamorak &&
                    <li>
                        (8+) <span className="Resistance">Lamorak</span>: Sees two pairs of players, one pair is on the same team, one is on opposite teams
                    </li>
                }
                {settings.sirrobin &&
                    settings.accolon
                        ?
                            <li>
                                (9+) <span className="Resistance">Sir Robin</span>: While conducting a mission, discovers a new <span className="Resistance">Resistance</span> member also on that mission; Blocked when <span className="Spy">Accolon</span> is on the same mission
                            </li>
                        :
                            <li>
                                (9+) <span className="Resistance">Sir Robin</span>: While conducting a mission, discovers a new <span className="Resistance">Resistance</span> member also on that mission
                            </li>
                }
                {settings.titania &&
                    <li>
                        (10)<span className="Resistance">Titania</span>: Appears as a <span className="Spy">spy</span> to a random <span className="Spy">spy</span> player
                    </li>
                }
            </ul>

            <FutureHeader headerType="h1" text={<><span className="Spy">Spy</span> Roles</>} />
            <ul>
                <li>
                    <span className="Spy">Mordred</span>: Not seen by <span className="Resistance">Merlin</span>
                </li>
                {settings.gaheris
                    ?
                        <li>
                            <span className="Spy">Morgana</span>: Seen as possible <span className="Resistance">Merlin</span> by <span className="Resistance">Percival</span>; Immunue to <span className="Resistance">resistance</span> binds
                        </li>
                    :
                        <li>
                            <span className="Spy">Morgana</span>: Seen as possible <span className="Resistance">Merlin</span> by <span className="Resistance">Percival</span>
                        </li>
                }
                <li>
                    <span className="Spy">Maelagant</span>: May play reverse cards
                </li>
                <li>
                    <span className="Spy">Colgrevance</span>: Sees roles of all <span className="Spy">spies</span>
                </li>
                {settings.accolon &&
                    settings.sirrobin
                        ?
                            <li>
                                (7+) <span className="Spy">Accolon</span>: Sabotages the vision of a random <span className="Resistance">resistance</span> player; Blocks <span className="Resistance">Sir Robin</span>'s ability if on that mission
                            </li>
                        :
                            <li>
                                (7+) <span className="Spy">Accolon</span>: Sabotages the vision of a random <span className="Resistance">resistance</span> player
                            </li>
                }
                {settings.cerdic &&
                    <li>
                        (7+) <span className="Spy">Cerdic</span>: Can bind a player on a mission to the <span className="Spy">Spies</span>
                    </li>
                }
                {settings.cynric && 
                     <li>
                        (7+) <span className="Spy">Cynric</span>: Can protect a player on a mission from a <span className="Resistance">resistance</span> bind
                    </li>
                }
                <li>
                    (8+) <span className="Spy">Lucius</span>: Sees <span className="Resistance">resistance</span> roles not related to assassinatable roles
                </li>
            </ul>

            <FutureHeader headerType="h1" text="Role Generation" />
            <ul>
                <li>Only one of the following can be present:
                    <ul>
                        <li><span className="Resistance">Merlin</span></li>
                        <li><span className="Resistance">Tristan</span> and <span className="Resistance">Iseult</span></li>
                        {settings.ector &&
                            <li><span className="Resistance">Ector</span></li>
                        }
                    </ul>
                </li>
                <li>Only one of the following can be present:
                    <ul>
                        <li><span className="Resistance">Tristan</span> and <span className="Resistance">Iseult</span></li>
                        <li><span className="Resistance">Uther</span></li>
                        <li><span className="Resistance">Galahad</span></li>
                    </ul>
                </li>
                <li>Only one of the following can be present:
                    <ul>
                        <li><span className="Resistance">Percival</span></li>
                        <li><span className="Resistance">Guinevere</span></li>
                    </ul>
                </li>
                <li>Only one of the following can be present:
                    <ul>
                        <li><span className="Resistance">Lancelot</span></li>
                        <li><span className="Resistance">Puck</span></li>
                    </ul>
                </li>
                {settings.accolon && settings.sirrobin &&
                    <li>Only one of the following can be present:
                        <ul>
                            <li><span className="Resistance">Kay</span></li>
                            <li><span className="Resistance">Sir Robin</span></li>
                        </ul>
                    </li>
                }
                <li>If <span className="Resistance">Galahad</span> is present, then <span className="Resistance">Arthur</span> is</li>
                <li>If <span className="Resistance">Merlin</span> is present, then <span className="Spy">Mordred</span> or <span className="Resistance">Puck</span> is</li>
                <li>If <span className="Spy">Mordred</span> is present, then <span className="Resistance">Merlin</span> is</li>
                <li>If <span className="Spy">Morgana</span> is present, then <span className="Resistance">Percival</span> is</li>
                {settings.cynric && settings.gaheris &&
                    <li>If <span className="Spy">Cynric</span> is present, then <span className="Resistance">Gaheris</span> is</li>
                }
                {settings.ector &&
                    <li>If <span className="Resistance">Ector</span> is present, the following cannot be present:
                        <ul>
                            <li><span className="Resistance">Merlin</span></li>
                            <li><span className="Resistance">Tristan</span> and <span className="Resistance">Iseult</span></li>
                            <li><span className="Resistance">Uther</span></li>
                            <li><span className="Resistance">Galahad</span></li>
                            <li><span className="Resistance">Percival</span></li>
                            <li><span className="Resistance">Guinevere</span></li>
                            {settings.kay &&
                                <li><span className="Resistance">Kay</span></li>
                            }
                            {settings.sirrobin &&
                                <li><span className="Resistance">Sir Robin</span></li>
                            }
                            <li><span className="Spy">Morgana</span></li>
                            <li><span className="Spy">Mordred</span></li>
                            {settings.accolon &&
                                <li><span className="Spy">Accolon</span></li>
                            }
                        </ul>
                    </li>
                }
                {settings.accolon && settings.cerdic &&
                    <li>Only one of the following can be present:
                        <ul>
                            <li><span className="Spy">Accolon</span></li>
                            <li><span className="Spy">Cerdic</span></li>
                        </ul>
                    </li>
                }
                {settings.geraint && settings.cerdic &&
                    <li>If <span className="Resistance">Geraint</span> is present, then <span className="Spy">Cerdic</span> is</li>
                }
            </ul>
        </div>
    )
}
