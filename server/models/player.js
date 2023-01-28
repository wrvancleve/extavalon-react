const Roles = require('./roles');

function Player(id, name) {
    this.id = id;
    this.name = name;
    this.role = null;
    this.isSpy = null;
    this.intel = [];
    this.intelSabotaged = false;
}

Player.prototype.assignRole = function(role) {
    this.role = role;
    this.isSpy = role.team === 'Spies';
    this.isAssassin = false;
}

Player.prototype.setIsAssassin = function() {
    this.isAssassin = true;
}

Player.prototype.addIntel = function(intel) {
    this.intel.push(intel);
}

Player.prototype.performSabotage = function(newIntel) {
    this.intel.splice(0, 1, newIntel);
    this.intelSabotaged = true;
}

Player.prototype.getPlayerInformation = function(playerInformationFields) {
    let includeId = true;
    let includeName = true;
    let includeRole = false;
    let includeTeam = false;
    let includeIntel = false;
    if (playerInformationFields) {
        includeId = playerInformationFields.includes('id');
        includeName = playerInformationFields.includes('name');
        includeRole = playerInformationFields.includes('role');
        includeTeam = playerInformationFields.includes('team');
        includeIntel = playerInformationFields.includes('intel');
    }

    const playerInformation = {};
    if (includeId) {
        playerInformation.id = this.id;
    }
    if (includeName) {
        playerInformation.name = this.name;
    }
    if (includeRole) {
        playerInformation.role = this.role.name;
    }
    if (includeTeam) {
        playerInformation.team = this.role.team;
    }
    if (includeIntel) {
        playerInformation.intel = this.intel;
    }
    return playerInformation;
}

Player.prototype.getPlayerHTML = function() {
    switch (this.role.name) {
        case Roles.Merlin.name:
            return this._getMerlinHTML();
        case Roles.Percival.name:
            return this._getPercivalHTML();
        case Roles.Uther.name:
            return this._getUtherHTML();
        case Roles.Lancelot.name:
            return this._getLancelotHTML();
        case Roles.Tristan.name:
            return this._getTristanHTML();
        case Roles.Iseult.name:
            return this._getIseultHTML();
        case Roles.Puck.name:
            return this._getPuckHTML();
        case Roles.Arthur.name:
            return this._getArthurHTML();
        case Roles.Guinevere.name:
            return this._getGuinevereHTML();
        case Roles.Bedivere.name:
            return this._getBedivereHTML();
        case Roles.Jester.name:
            return this._getJesterHTML();
        case Roles.Galahad.name:
            return this._getGalahadHTML();
        case Roles.Titania.name:
            return this._getTitaniaHTML();
        case Roles.Ector.name:
            return this._getEctorHTML();
        case Roles.Kay.name:
            return this._getKayHTML();
        case Roles.Lamorak.name:
            return this._getLamorakHTML();
        case Roles.SirRobin.name:
            return this._getSirRobinHTML();
        case Roles.Gaheris.name:
            return this._getGaherisHTML();
        case Roles.Geraint.name:
            return this._getGeraintHTML();
        case Roles.Mordred.name:
            return this._getMordredHTML();
        case Roles.Morgana.name:
            return this._getMorganaHTML();
        case Roles.Maelagant.name:
            return this._getMaelagantHTML();
        case Roles.Colgrevance.name:
            return this._getColgrevanceHTML();
        case Roles.Lucius.name:
            return this._getLuciusHTML();
        case Roles.Accolon.name:
            return this._getAccolonHTML();
        case Roles.Cerdic.name:
            return this._getCerdicHTML();
        case Roles.Cynric.name:
            return this._getCynricHTML();
        default:
            return null;
    }
}

Player.prototype._getMerlinHTML = function() {
    let merlinHTML = `<h2 class="future-header Resistance">Merlin</h2><section>`;
    if (this.intelSabotaged) {
        merlinHTML += `
            <p>Your vision has been sabotaged by <span class="Spy">Accolon</span></p>
            <p>One of the players you see is not a <span class="Spy">spy</span> or <span class="Resistance">Puck</span></p>
        `;
    }
    merlinHTML += `<p>You see:</p></section><section>`;

    const seenPlayers = this.intel[0];
    for (let i = 0; i < seenPlayers.length; i++) {
        merlinHTML += `
            <p>${seenPlayers[i].name} is <span class="Spy">evil</span>
            or <span class="Resistance">Puck</span></p>
        `;
    }
    merlinHTML += `
        </section>
        <section>
            <p>Keep your identity and knowledge a secret; you can be assassinated.</p>
        </section>
    `;

    return merlinHTML;
}

Player.prototype._getPercivalHTML = function() {
    let percivalHTML = `
        <h2 class="future-header Resistance">Percival</h2><section>
    `;
    if (this.intelSabotaged) {
        percivalHTML += `
            <p>Your vision has been sabotaged by <span class="Spy">Accolon</span></p>
            <p>One of the players you see is not <span class="Resistance">Merlin</span> or <span class="Spy">Morgana</span></p>
        `;
    }
    percivalHTML += `<p>You see:</p></section><section>`;

    const seenPlayers = this.intel[0];
    for (let i = 0; i < seenPlayers.length; i++) {
        percivalHTML += `
            <p>${seenPlayers[i].name} is <span class="Resistance">Merlin</span> or
            <span class="Spy">Morgana</span></p>
        `;
    }
    percivalHTML += `
        </section>
        <section>
            <p>Keep your knowledge a secret; <span class="Resistance">Merlin</span> can be assassinated.</p>
        </section>
    `;

    return percivalHTML;
}

Player.prototype._getTristanHTML = function() {
    let tristanHTML = `
        <h2 class="future-header Resistance">Tristan</h2><section>
    `;
    if (this.intelSabotaged) {
        tristanHTML += `
            <p>Your vision has been sabotaged by <span class="Spy">Accolon</span></p>
            <p>One of the players you see is not <span class="Resistance">Iseult</span></p>
        `;
    }
    tristanHTML += `<p>You see:</p></section><section>`;

    const seenPlayers = this.intel[0];
    for (let i = 0; i < seenPlayers.length; i++) {
        tristanHTML += `<p>${seenPlayers[i].name} is <span class="Resistance">Iseult</span></p>`;
    }
    tristanHTML += `
        </section>
        <section>
            <p>Keep your identity and knowledge a secret; you and <span class="Resistance">Iseult</span> can be assassinated together.</p>
        </section>
    `;

    return tristanHTML;
}

Player.prototype._getIseultHTML = function() {
    let iseultHTML = `
        <h2 class="future-header Resistance">Iseult</h2><section>
    `;
    if (this.intelSabotaged) {
        iseultHTML += `
            <p>Your vision has been sabotaged by <span class="Spy">Accolon</span></p>
            <p>One of the players you see is not <span class="Resistance">Tristan</span></p>
        `;
    }
    iseultHTML += `<p>You see:</p></section><section>`;

    const seenPlayers = this.intel[0];
    for (let i = 0; i < seenPlayers.length; i++) {
        iseultHTML += `<p>${seenPlayers[i].name} is <span class="Resistance">Tristan</span></p>`;
    }
    iseultHTML += `
        </section>
        <section>
            <p>Keep your identity and knowledge a secret; you and <span class="Resistance">Tristan</span> can be assassinated together.</p>
        </section>
    `;

    return iseultHTML;
}

Player.prototype._getUtherHTML = function() {
    let utherHTML = `
        <h2 class="future-header Resistance">Uther</h2><section>
    `;
    if (this.intelSabotaged) {
        utherHTML += `
            <p>Your vision has been sabotaged by <span class="Spy">Accolon</span></p>
            <p>One of the players you see may or may not be <span class="Resistance">good</span></p>
        `;
    }
    utherHTML += `<p>You see:</p></section><section>`;

    const seenPlayers = this.intel[0];
    for (let i = 0; i < seenPlayers.length; i++) {
        utherHTML += `<p>${seenPlayers[i].name} is <span class="Resistance">good</span></p>`;
    }
    utherHTML += `</section>`;

    return utherHTML;
}

Player.prototype._getArthurHTML = function() {
    let arthurHTML = `
        <h2 class="future-header Resistance">Arthur</h2><section>
    `;
    if (this.intelSabotaged) {
        arthurHTML += `
            <p>Your vision has been sabotaged by <span class="Spy">Accolon</span></p>
        `;
    }
    arthurHTML += `<p>You see:</p></section><section>`;

    const seenRoles = this.intel[0];
    for (let i = 0; i < seenRoles.length; i++) {
        const seenRole = seenRoles[i];
        if (seenRole) {
            arthurHTML += `<p><span class="Resistance">${seenRole}</span> is in the game</p>`;
        } else {
            arthurHTML += `<p>??? is in the game</p>`;
        }
    }
    arthurHTML += `
        </section>
        <section>
            <p>Keep your identity and knowledge a secret; you can be assassinated.</p>
        </section>
    `;

    if (this.intel.length > 1) {
        arthurHTML += this._getResistanceEctorHTML();
    }

    return arthurHTML;
}

Player.prototype._getEctorHTML = function () {
    return `
        <h2 class="future-header Resistance">Ector</h2>
        <section>
            <p>All <span class="Resistance">resistance</span> members see you as <span class="Resistance">Ector</span>.</p>
            <p>Unfortunately, you need to identify your fellow <span class="Resistance">resistance</span> members.</p>
        </section>
        <section>
            <p>Keep your identity a secret; you can be assassinated.</p>
        </section>
    `;
}

Player.prototype._getLancelotHTML = function() {
    let lancelotHTML = `
        <h2 class="future-header Resistance">Lancelot</h2>
        <section><p>You may play reverse cards while on missions.</p></section>
    `;

    if (this.intel.length > 1) {
        lancelotHTML += this._getResistanceEctorHTML();
    }

    return lancelotHTML;
}

Player.prototype._getPuckHTML = function() {
    let puckHTML = `
        <h2 class="future-header Resistance">Puck</h2>
        <section>
            <p>You only win if the <span class="Resistance">Resistance</span> wins on mission 5.</p>
            <p>You may play fail cards while on missions.</p>
            <p>
                If <span class="Resistance">Merlin</span> is in the game, you are seen by
                <span class="Resistance">Merlin</span> as a possible <span class="Spy">spy</span>.
            </p>
        </section>
    `;

    if (this.intel.length > 1) {
        puckHTML += this._getResistanceEctorHTML();
    }

    return puckHTML;
}

Player.prototype._getJesterHTML = function() {
    const seenRoles = this.intel[0];

    let jesterHTML = `
        <h2 class="future-header Resistance">Jester</h2>
        <section><p>You only win if you get assassinated by the assassin.</p></section>
        <section><p>You see:</p></section><section>
    `;
    for (let i = 0; i < seenRoles.length; i++) {
        jesterHTML += `<p><span class="Resistance">${seenRoles[i]}</span> is in the game</p>`;
    }
    jesterHTML += `</section>`;

    if (this.intel.length > 1) {
        jesterHTML += this._getResistanceEctorHTML();
    }

    return jesterHTML;
}

Player.prototype._getGuinevereHTML = function() {
    let guinevereHTML = `
        <h2 class="future-header Resistance">Guinevere</h2><section>
    `;
    if (this.intelSabotaged) {
        guinevereHTML += `
            <p>Your vision has been sabotaged by <span class="Spy">Accolon</span></p>
            <p>One of the players you see is not <span class="Resistance">Lancelot</span> or <span class="Spy">Maelagant</span></p>
        `;
    }
    guinevereHTML += `<p>You see:</p></section><section>`;

    const seenPlayers = this.intel[0];
    for (let i = 0; i < seenPlayers.length; i++) {
        const seenPlayer = seenPlayers[i];
        guinevereHTML += `
            <p>${seenPlayer.name} is <span class="Resistance">Lancelot</span> or
            <span class="Spy">Maelagant</span></p>
        `;
    }
    guinevereHTML += `</section>`;

    return guinevereHTML;
}

Player.prototype._getBedivereHTML = function() {
    let bedivereHTML = `
        <h2 class="future-header Resistance">Bedivere</h2><section>
    `;
    if (this.intelSabotaged) {
        bedivereHTML += `
            <p>Your vision has been sabotaged by <span class="Spy">Accolon</span></p>
        `;
    }
    bedivereHTML += `<p>You see:</p></section><section>`;

    const seenRoles = this.intel[0];
    for (let i = 0; i < seenRoles.length; i++) {
        const seenRole = seenRoles[i];
        if (seenRole) {
            bedivereHTML += `<p><span class="Spy">${seenRole}</span> is in the game</p>`;
        } else {
            bedivereHTML += `<p>??? is in the game</p>`;
        }
    }
    bedivereHTML += `</section>`;

    if (this.intel.length > 1) {
        bedivereHTML += this._getResistanceEctorHTML();
    }

    return bedivereHTML;
}

Player.prototype._getGalahadHTML = function() {
    let galahadHTML = `
        <h2 class="future-header Resistance">Galahad</h2><section>
    `;
    if (this.intelSabotaged) {
        galahadHTML += `
            <p>Your vision has been sabotaged by <span class="Spy">Accolon</span></p>
            <p>One of the players you see is not <span class="Resistance">Arthur</span></p>
        `;
    }
    galahadHTML += `<p>You see:</p></section><section>`;

    const seenPlayers = this.intel[0];
    for (let i = 0; i < seenPlayers.length; i++) {
        galahadHTML += `<p>${seenPlayers[i].name} is <span class="Resistance">Arthur</span></p>`;
    }
    galahadHTML += `
        </section>
        <section>
            <p>Keep your knowledge a secret; <span class="Resistance">Arthur</span> can be assassinated.</p>
        </section>
    `;

    return galahadHTML;
}

Player.prototype._getTitaniaHTML = function() {
    let titaniaHTML = `
        <h2 class="future-header Resistance">Titania</h2>
        <section>
            <p>You sabotaged a member of the <span class="Spy">spies</span>.</p>
            <p>That member sees you as a possible <span class="Spy">spy</span>.</p>
        </section>
    `;

    if (this.intel.length > 1) {
        titaniaHTML += this._getResistanceEctorHTML();
    }

    return titaniaHTML;
}

Player.prototype._getKayHTML = function () {
    return `
        <h2 class="future-header Resistance">Kay</h2>
        <section>
            <p>If the <span class="Spy">spies</span> win 3 missions,</p>
            <p>you are given the opportunity to redeem the <span class="Resistance">Resistance</span>.</p>
            <p>Correctly name all <span class="Spy">spies</span> and the game will progress as if the <span class="Resistance">Resistance</span> had won 3 missions.</p>
        </section>
    `;
}

Player.prototype._getLamorakHTML = function () {
    let lamorakHTML = `
        <h2 class="future-header Resistance">Lamorak</h2><section>
    `;
    if (this.intelSabotaged) {
        lamorakHTML += `
            <p>Your vision has been sabotaged by <span class="Spy">Accolon</span></p>
            <p>You were inserted into one of your pairs. This gives you less information than you normally would have.</p>
        `;
    }
    lamorakHTML += `
        <p>You see two pairs of players:</p></section>
        <section>
            <p>${this.intel[0][0][0].name} and ${this.intel[0][0][1].name}</p>
            <p>${this.intel[0][1][0].name} and ${this.intel[0][1][1].name}</p>
        </section>
        <section>
            <p>One pair of players are on the same team and the other pair of players are on different teams.</p>
        </section>
    `;

    if (this.intel.length > 1) {
        lamorakHTML += this._getResistanceEctorHTML();
    }

    return lamorakHTML;
}

Player.prototype._getSirRobinHTML = function () {
    return `
        <h2 class="future-header Resistance">Sir Robin</h2>
        <section>
            <p>While conducting a mission, discover a new member of the <span class="Resistance">Resistance</span> that is also on the mission.</p>
            <p>If <span class="Spy">Accolon</span> is present and is on the same mission, your ability is blocked.</p>
        </section>
    `;
}

Player.prototype._getGaherisHTML = function () {
    let gaherisHTML = `
        <h2 class="future-header Resistance">Gaheris</h2>
        <section>
            <p>While voting for a team, you may attempt to bind one player to the <span class="Resistance">Resistance</span>.</p>
            <p>If the team is approved, the bind will be attempted on the player.
            <p>If the bind is not blocked, the player bound must play a success unless the player is <span class="Spy">Morgana</span>.</p>
            <p>Once the bind is attempted, this bind can no longer be attempted.</p>
            <p>On later missions that can result in the game ending, no binds can occur.</p>
        </section>
    `;

    if (this.intel.length > 1) {
        gaherisHTML += this._getResistanceEctorHTML();
    }

    return gaherisHTML;
}

Player.prototype._getGeraintHTML = function () {
    let geraintHTML = `
        <h2 class="future-header Resistance">Geraint</h2>
        <section>
            <p>While voting for a team, you may protect one player from a <span class="Spy">Spy</span> bind.</p>
            <p>A player that is <span class="Spy">Spy</span> bound must play a fail.</p>
            <p>If the team is approved, the protection will block a <span class="Spy">Spy</span> bind attempted on that player.</p>
            <p>You may keep attempting a protection while the <span class="Spy">Spy</span> bind can still be used.</p>
            <p>On later missions that can result in the game ending, no binds or protections can occur.</p>
        </section>
    `;

    if (this.intel.length > 1) {
        geraintHTML += this._getResistanceEctorHTML();
    }

    return geraintHTML;
}

Player.prototype._getResistanceEctorHTML = function () {
    return `
        <section>
            <p>You and fellow <span class="Resistance">resistance</span> members have been blessed by the presense of <span class="Resistance">Ector</span>.</p>
            <p>${this.intel[1].name} is <span class="Resistance">Ector</span>.</p>
            <p>Keep this information a secret; <span class="Resistance">Ector</span> can be assassinated.</p>
        </section>
    `;
}

Player.prototype._getMordredHTML = function() {
    let mordredHTML = `
        <h2 class="future-header Spy">Mordred</h2>
        <section><p>You are not seen by <span class="Resistance">Merlin</span>.</p></section>
    `;

    mordredHTML += this._getSpyHTML();
    return mordredHTML;
}

Player.prototype._getMorganaHTML = function() {
    let morganaHTML = `
        <h2 class="future-header Spy">Morgana</h2>
        <section><p>You are seen by <span class="Resistance">Percival</span> as a possible <span class="Resistance">Merlin</span>.</p></section>
    `;

    morganaHTML += this._getSpyHTML();
    return morganaHTML;
}

Player.prototype._getMaelagantHTML = function() {
    let maelagantHTML = `
        <h2 class="future-header Spy">Maelagant</h2>
        <section><p>You may play reverse cards while on missions.</p></section>
    `;

    maelagantHTML += this._getSpyHTML();
    return maelagantHTML;
}

Player.prototype._getColgrevanceHTML = function() {
    let colgrevanceHTML = `<h2 class="future-header Spy">Colgrevance</h2>`;
    colgrevanceHTML += this._getSpyHTML();
    return colgrevanceHTML;
}

Player.prototype._getAccolonHTML = function() {
    let accolonHTML = `
        <h2 class="future-header Spy">Accolon</h2>
        <section>
            <p>You sabotaged the vision of a <span class="Resistance">resistance</span> player.</p>
        </section>
    `;
    accolonHTML += this._getSpyHTML();
    return accolonHTML;
}

Player.prototype._getLuciusHTML = function() {
    let luciusHTML = `
        <h2 class="future-header Spy">Lucius</h2>
        <section>
            <p>You hijacked some <span class="Resistance">resistance</span> roles:</p>
        </section><section>
    `;

    const seenRoles = this.intel[1];
    for (let i = 0; i < seenRoles.length; i++) {
        const seenRole = seenRoles[i];
        luciusHTML += `<p><span class="Resistance">${seenRole}</span> is in the game</p>`;
    }
    luciusHTML += `</section>`;

    luciusHTML += this._getSpyHTML();
    return luciusHTML;
}

Player.prototype._getCerdicHTML = function() {
    let cerdicHTML = `
        <h2 class="future-header Spy">Cerdic</h2>
        <section>
            <p>While voting for a team, you may attempt to bind one player to the <span class="Spy">Spies</span>.</p>
            <p>If the team is approved, the bind will be attempted on the player.
            <p>If the bind is not blocked, the player bound must play a fail.</p>
            <p>Once the bind is attempted, this bind can no longer be attempted.</p>
            <p>On later missions that can result in the game ending, no binds can occur.</p>
        </section>
    `;
    cerdicHTML += this._getSpyHTML();
    return cerdicHTML;
}

Player.prototype._getCynricHTML = function() {
    let cynricHTML = `
        <h2 class="future-header Spy">Cynric</h2>
        <section>
            <p>While voting for a team, you may protect one player from a <span class="Resistance">Resistance</span> bind.</p>
            <p>A player that is <span class="Resistance">Resistance</span> bound must play a success unless the player is <span class="Spy">Morgana</span>.</p>
            <p>If the team is approved, the protection will block a <span class="Resistance">Resistance</span> bind attempted on that player.</p>
            <p>You may keep attempting a protection while the <span class="Resistance">Resistance</span> bind can still be used.</p>
            <p>On later missions that can result in the game ending, no binds or protections can occur.</p>
        </section>
    `;
    cynricHTML += this._getSpyHTML();
    return cynricHTML;
}

Player.prototype._getSpyHTML = function() {
    let spyHTML = "";
    if (this.isAssassin) {
        spyHTML += `<section><p>You are also the assassin.</p></section>`;
    }

    if (this.intelSabotaged) {
        spyHTML += `
            <section><p>Your vision has been sabotaged by <span class="Resistance">Titania</span></p>
            <p>One of the players you see is not a <span class="Spy">spy</span></p>
            <p>You see:</p></section><section>
        `;
    } else {
        spyHTML += `<section><p>You see:</p></section><section>`;
    }

    const seenSpies = this.intel[0];
    for (let i = 0; i < seenSpies.length; i++) {
        const seenSpy = seenSpies[i];
        if ('role' in seenSpy) {
            spyHTML += `
                <p>
                    ${i + 1}) ${seenSpy.name} is <span class="Spy">${seenSpy.role}</span>
                </p>
            `;
        } else {
            spyHTML += `<p>${i + 1}) ${seenSpy.name} is <span class="Spy">evil</span></p>`;
        }
    }
    spyHTML += `</section>`;

    return spyHTML;
}

module.exports = Player