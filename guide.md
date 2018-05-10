Shockball Guide
======
<img width="150" height="150" align="right" src="https://raw.githubusercontent.com/bpkennedy/shockball2/master/public/img/shockballLogo.png"/>

> **<sub>No credits will be required or sent during the Alpha</sub>**
##### Table of Contents

* As Player:
  1. [How to sign up as a player](#how-to-sign-up-as-a-player)
  2. [How to train your player](#how-to-train-your-player)
  3. [What skills change when I train](#what-skills-change-when-I-train)
  4. [How to accept or reject a contract](#how-to-accept-or-reject-a-contract)
* As Team Owner:
  1. [How to create a Team](#how-to-create-a-team)
  2. [How to offer a player a contract](#how-to-offer-a-player-a-contract)
  3. [How to set your team lineup](#how-to-set-your-team-lineup)
* Problems and Common Questions
  * [The offer contract button is not there](#the-offer-contract-button-is-not-there)
  * [Cannot spend more than available team budget](#cannot-spend-more-than-available-team-budget)
  * [Must offer player a minimum bid equal to their market value](#must-offer-player-a-minimum-bid-equal-to-their-market-value)

### How to sign up as a player
1. Go to https://shockball2.herokuapp.com and **Login** and then click **Allow**
2. If you see your avatar image then your registration/signup completed without issue.  You are ready to roll!
> The *Character Read* permission from combine allows the shockball application to get your combine character’s basic info for creating your name, profile image, and unique id.

### How to train your player
Each day, you may select a training regimen for your player. Every 24 hours your selected player performs their training for permanent skill changes (some increment, some decrement) depending on which regimen you select. Players must choose to train every day to get the most growth!

1. Go to your **Me** page (the default when you visit the website)
2. Select the **Training Regimen** drop-down and pick your preference.
3. You should see a onscreen confirmation of your selection.

### What skills change when I train
Here are the skill changes:
```javascript
if (player.regimen.value === 'Wing') {
        // primary skill passing, secondary endurance and throwing
        player.blocking = decrement(player.blocking, .25, player.blockingCap)
        player.throwing = increment(player.throwing, .5, player.throwingCap)
        player.passing = increment(player.passing, 1, player.passingCap)
        player.endurance = increment(player.endurance, .5, player.enduranceCap)
        player.toughness = decrement(player.toughness, .25, player.toughnessCap)
        player.vision = decrement(player.vision, .25, player.visionCap)
        player.morale = increment(player.morale, 1)
        player.energy = decrement(player.energy, 5)
        player.leadership = increment(player.leadership, .25)
    } else if (player.regimen.value === 'Guard') {
        // primary skill blocking, secondary vision and throwing
        player.blocking = increment(player.blocking, 1.5, player.blockingCap)
        player.throwing = increment(player.throwing, .25, player.throwingCap)
        player.passing = decrement(player.passing, .25, player.passingCap)
        player.endurance = decrement(player.endurance, .25, player.enduranceCap)
        player.toughness = decrement(player.toughness, .25, player.toughnessCap)
        player.vision = increment(player.vision, .25, player.visionCap)
        player.morale = increment(player.morale, 1)
        player.energy = decrement(player.energy, 5)
        player.leadership = increment(player.leadership, .25)
    } else if (player.regimen.value === 'Center') {
        // primary skill vision, secondary toughness and endurance
        player.blocking = decrement(player.blocking, .25, player.blockingCap) 
        player.throwing = decrement(player.throwing, .25, player.throwingCap)
        player.passing = decrement(player.passing, .25, player.passingCap)
        player.endurance = increment(player.endurance, .5, player.enduranceCap)
        player.toughness = increment(player.toughness, 1, player.toughnessCap)
        player.vision = increment(player.vision, .5, player.visionCap)
        player.morale = increment(player.morale, 1)
        player.energy = decrement(player.energy, 5)
		player.leadership = increment(player.leadership, .25)
    } else if (player.regimen.value === 'General') {
        // all skills unchanged with a slow energy recovery
        player.blocking = increment(player.blocking, .0, player.blockingCap) 
        player.throwing = increment(player.throwing, 0, player.throwingCap)
        player.passing = increment(player.passing, .0, player.passingCap)
        player.endurance = increment(player.endurance, .0, player.enduranceCap)
        player.toughness = increment(player.toughness, .0, player.toughnessCap)
        player.vision = increment(player.vision, .0, player.visionCap)
        player.morale = increment(player.morale, 1)
        player.energy = increment(player.energy, 2)
		player.leadership = increment(player.leadership, .25)
    } else if (player.regimen.value === 'Rest') {
        // all skills suffer .25 decay with a fast energy recovery
        player.blocking = decrement(player.blocking, .25, player.blockingCap) 
        player.throwing = decrement(player.throwing, 25, player.throwingCap)
        player.passing = decrement(player.passing, .25, player.passingCap)
        player.endurance = decrement(player.endurance, .25, player.enduranceCap)
        player.toughness = decrement(player.toughness, .25, player.toughnessCap)
        player.vision = decrement(player.vision, .25, player.visionCap)
        player.morale = increment(player.morale, 5)
        player.energy = increment(player.energy, 10)
        player.leadership = increment(player.leadership, .25)
    } else {
        // no training selected
        // all skills suffer .25 decay with a slow energy recovery
        player.blocking = decrement(player.blocking, .25, player.blockingCap) 
        player.throwing = decrement(player.throwing, .25, player.throwingCap)
        player.passing = decrement(player.passing, .25, player.passingCap)
        player.endurance = decrement(player.endurance, .25, player.enduranceCap)
        player.toughness = decrement(player.toughness, .25, player.toughnessCap)
        player.vision = decrement(player.vision, .25, player.visionCap)
        player.morale = decrement(player.morale, .25)
        player.energy = increment(player.energy, 2)
        player.leadership = decrement(player.leadership, 1)
    }
```

### How to accept or reject a contract
In order to play on a team, a player must have an **active** contract with that team. Contracts are issued by the team’s owner and are for a single Season. Players receive a 20% signing bonus in their GSL account.  At the end of the season, players may “cash out” their account on request (i.e they will be sent the credits via combine).

1. Go to your **Office** page.
2. Find any contract(s) for your player in the **My Contract Offers** section.
3. If there is action waiting on you (like approval/rejection), you will see an **Approve/Reject** button in the contract row.  Click that.
4. Review the details of the contract and click **Accept** or **Reject**.
5. You should see an onscreen confirmation of your action.

### How to create a Team
A Shockball team requires the following:
* **team logo image URL**: a URL to a square pixel (example 200px by 200px or 1000px by 1000px)
* **team name**: which should consist of a planet or system prefix and then team name (example: Corellia Captains, Stensen Browbeaters)
* **team owner**: name of person who'll own and manage the team lineup and contracts, who must also exist as a Player in the league (must have logged in at least once)
* (OPTIONAL) **team stadium image URL**: a URL to a square pixel image
* (OPTIONAL) **team stadium name**: name of the team's home venue stadium 

1. Send your request to the [Discord Alpha channel](https://discord.gg/gxWphVs) with all that info. A team will be created for you and a starting account balance of 70Mil. <sub>Remember, this is non-real credits for Alpha...</sub>

### How to offer a player a contract
Teams can offer contracts to human players and NPC players. All players have a minimum market value based on their skills, and this minimum purchase price is enforced when offering a contract. While a human can accept or reject an offered contract, an NPC player will always accept the offer.

1. Go to the **Transfer Market** page and view all the players in the league. Players without a team appear as **Free Agents**.
2. Click on a player's name to be taken to that player's details page.
3. Find the blue button labeled **Offer Contract** and click it.
4. In the form's **Enter Purchase Price** field, enter the offer amount in whole numbers (Market Value is minimum you can offer).
5. In the form's **Pick Season** field, leave defaulted (will be enhanced in future for multiple seasons).
6. Click **Send Contract**
7. You should see an onscreen confirmation of your action.

At this point you can visit your **Office** page and view the team contracts. The states of a contract are:
* Pending - waiting for the Player to accept or reject
* Accepted - Player accepted, now waiting on league admin to approve
* Rejected - Player rejected your offer (currently there is no editing an existing contract offer - simply create a new one to renegotiate)
* Active - Player is now a member of the team, can be used in the lineup, and can participate in team matches.
> NPC players will automatically 'Accept' offered contracts, but they still require league admin approval before the contract is made active.

### How to set your team lineup
Teams can set a primary and secondary player for each position on the field (Left/Right Wing, Center, Guard). As a player gets tired, he/she will be rotated automatically with the other player in his role.

Example: Fipp is the primary Guard so he starts the game. When his energy gets below 20 percent, he is rotated out for Levon, the secondary Guard. And so forth.
> Currently players do not "swap" into other roles. Also, the substitute roles are not yet functional.

1. Go to the **Squad** page.
2. Scroll down to the game pitch map with images of players. Here you can click on a position and be presented with a list of your team players to select who should be in that position.
3. You should see a onscreen confirmation of your selection.

> *Bots* are there right now if your team is under the threshold of minimum players. In future, a minimum lineup (humans and/or npcs) will be required or forfeit the match. Bots are generated when the match is simulated, are random (with limits) in skill, and are destroyed after the match is over.

### The offer contract button is not there
If the player is already a member of a team, then the option to offer them a contract will not be visible.

### Cannot spend more than available team budget
Your team has an account, and two representations of it on the **Office** page. You will find a **Potential Budget** and a **Available Budget**. The Potential Budget is the total amount of credits in your account at this moment. The Available Budget is the amount available minus any pending commitments (like contract offers that are pending). You receive this particular error when you are trying to offer a contract and the amount required will put you over what is left in your Available Budget.

### Must offer player a minimum bid equal to their market value
When offering a contract to a player, you are required to offer **at least the market value**. You may always offer more.
