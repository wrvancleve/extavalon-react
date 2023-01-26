import React from 'react';

import FutureHeader from '../../common/futureHeader/FutureHeader';

export default function Result({gameResultInformation}) {
    const winner = gameResultInformation.winner;
    const assassination = gameResultInformation.assassination;
    const assassinName = assassination.assassin.name;
    const assassinationTargetRole = assassination.role;
    const assassinationTargets = assassination.targets ?? [];
    const jester = gameResultInformation.jester;
    const puck = gameResultInformation.puck;

    function getWinnerHeader() {
        if (winner === "Spies") {
            if (assassination) {
                return getSpyAssassinationWinHeader();
            } else {
                return <FutureHeader headerType="h2" text={<><span class="Spy">Spies</span> win!</>} />
            }
        } else {
            if (winner === "Resistance") {
                return getResistanceWinHeader();
            } else {
                return getJesterAssassinationWinHeader();
            }
        }
    }

    function getSpyAssassinationWinHeader() {
        return <>
            <FutureHeader headerType="h2" text={<><span class="Spy">Spies</span> win!</>} />
            <section>
                <p>
                    <span className="Spy">{assassinName}</span> correctly assassinated {assassinationTargets.map(target => `<span class="Resistance">${target.name}</span>`).join(' and ')} as <span className="Resistance">{assassinationTargetRole}</span>.
                </p>
            </section>
        </>
    }

    function getResistanceWinHeader() {
        let winnerDescriptor = <span class="Resistance">Resistance</span>;
        let loserDescriptor = null;

        if (puck) {
            if (puck.won) {
                winnerDescriptor = <>
                    <span class="Resistance">Resistance</span> (including <span class="Resistance">${puck.name}</span> as <span class="Resistance">Puck</span>)
                </>;
            } else {
                loserDescriptor = <p>
                    <span class="Resistance">{puck.name}</span> failed to extend the game to 5 rounds and has lost as <span class="Resistance">Puck</span>!
                </p>;
            }
        }
        if (jester) {
            loserDescriptor = <p>
                <span class="Resistance">${jester.name}</span> failed to get assassinated and has lost as <span class="Resistance">Jester</span>!
            </p>;
        }

        return <>
            <FutureHeader headerType="h2" text={<>{winnerDescriptor} wins!</>} />
            <section>
                <p>
                    <span class="Spy">{assassinName}</span> incorrectly assassinated {assassinationTargets.map(target => `<span class="Resistance">${target.name}</span>`).join(' and ')} as <span class="Resistance">${assassinationTargetRole}</span>.
                </p>
                {loserDescriptor &&
                    loserDescriptor
                }
            </section>
        </>
    }

    function getJesterAssassinationWinHeader() {
        return <>
            <FutureHeader headerType="h2" text={`${jester.name} wins!`} />
            <section>
                <p>
                    <span class="Spy">{assassinName}</span> attempted to assassinate {assassinationTargets.map(target => `<span class="Resistance">${target.name}</span>`).join(' and ')} as <span class="Resistance">${assassinationTargetRole}</span>.
                </p>
                <p>However, <span class="Resistance">${jester.name}</span> was the <span class="Resistance">Jester</span>!</p>
            </section>
        </>
    }

    return (
        <>
            {getWinnerHeader()}
            <section>
                <p><span class="Resistance">Resistance</span>:</p>
                {gameResultInformation.resistance.map((player, playerIndex) => {
                    return <p key={playerIndex}>(<span class="Resistance">{player.role}</span>) {player.name}</p>
                })}
            </section>
            <section>
                <p><span class="Spy">Spies</span>:</p>
                {gameResultInformation.spies.map((player, playerIndex) => {
                    return <p key={playerIndex}>(<span class="Spy">{player.role}</span>) {player.name}</p>
                })}
            </section>
        </>
    )
}
