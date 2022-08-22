<div id="menuToggle">
	<input type="checkbox" />
	<span />
	<span />
	<span />
	<ul id="menu">
		<li>
			<a href="/race/next">Prochaine course</a>
		</li>
		<li>
			<a href="/race">Précédentes courses</a>
		</li>
		<li>
			<a href="/admin/login">Espace Bénévole</a>
		</li>
		<slot name="header" />
	</ul>
</div>

<style>
	#menuToggle {
		display: block;
		position: relative;
		top: 1rem;
		left: 1rem;
		z-index: 1;
		-webkit-user-select: none;
		user-select: none;
	}

	#menuToggle a {
		transition: color 0.3s ease;
		box-shadow: none;
		color: black;
	}
	#menuToggle a:hover {
		color: blue;
	}

	#menuToggle input {
		display: block;
		width: 40px;
		height: 32px;
		position: absolute;
		top: -7px;
		left: -5px;
		cursor: pointer;
		opacity: 0; /* hide this */
		z-index: 2; /* and place it over the hamburger */
		-webkit-touch-callout: none;
	}

	/*
 * Just a quick hamburger
 */
	#menuToggle span {
		display: block;
		width: 33px;
		height: 4px;
		margin-bottom: 5px;
		position: relative;
		background: #cdcdcd;
		border-radius: 3px;
		z-index: 1;
		transform-origin: 4px 0px;
		transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
			background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;
	}
	#menuToggle span:first-child {
		transform-origin: 0% 0%;
	}
	#menuToggle span:nth-last-child(2) {
		transform-origin: 0% 100%;
	}

	/* 
  * Transform all the slices of hamburger
  * into a crossmark.
  */
	#menuToggle input:checked ~ span {
		opacity: 1;
		transform: rotate(45deg) translate(-2px, -1px);
		background: #232323;
	}
	/*
  * But let's hide the middle one.
  */
	#menuToggle input:checked ~ span:nth-last-child(3) {
		opacity: 0;
		transform: rotate(0deg) scale(0.2, 0.2);
	}
	/*
  * Ohyeah and the last one should go the other direction
  */
	#menuToggle input:checked ~ span:nth-last-child(2) {
		transform: rotate(-45deg) translate(0, -1px);
	}

	/*
 * Make this absolute positioned
 * at the top left of the screen
 */
	#menu {
		position: absolute;
    width: 100vh;
		margin: -100px 0 0 -50px;
		padding: 50px;
		padding-top: 125px;

		background: #ededed;
		list-style-type: none;
		-webkit-font-smoothing: antialiased;
		/* to stop flickering of text in safari */

		transform-origin: 0% 0%;
		transform: translate(-100%, 0);

		transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
	}

	#menu li {
		padding: 10px 0;
		font-size: 22px;
	}

	/*
 * And let's slide it in from the left
 */
	#menuToggle input:checked ~ ul {
		transform: none;
	}

	@media screen and (min-width: 520px) {
		#menuToggle {
      width: 100%;
			height: 100%;
			top: 0;
			left: 0;
		}

		#menuToggle input,
		#menuToggle span {
			display: none;
		}

		#menu {
      position: relative;
      margin: 0;
      padding: 0;
      padding-top: 1rem;
			box-sizing: border-box;
      width: auto;
			height: 100%;
			transform: none;
			background: rgba(237, 237, 237, 0.5);
		}
		#menu li {
			padding-left: 1rem;
		}
		#menu li:not(:nth-child(2)):last-child {
			position: absolute;
			bottom: 1rem;
		}
	}
</style>
