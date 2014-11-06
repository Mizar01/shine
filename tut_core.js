
var stage = null
var renderer = null
var far = null
var mid = null

function init() {
	stage = new PIXI.Stage(0x66FF99)
	renderer = PIXI.autoDetectRenderer(512, 384)
	var cc = document.createElement("div")
	cc.id = "canvas_container"
	cc.align = "center"
	document.body.appendChild(cc)
	document.getElementById("canvas_container").appendChild(renderer.view)


	var farTexture = PIXI.Texture.fromImage("resources/bg-far.png");
	far = new PIXI.TilingSprite(farTexture, 512, 256)
	far.position.x = 0
	far.position.y = 0
	stage.addChild(far)

	var midTexture = PIXI.Texture.fromImage("resources/bg-mid.png");
  	mid = new PIXI.TilingSprite(midTexture, 512, 256);
  	mid.position.x = 0;
  	mid.position.y = 128;
  	stage.addChild(mid)

	requestAnimFrame(animate)
}

function animate() {
	far.tilePosition.x -= 0.5
	mid.tilePosition.x -= 0.8
	renderer.render(stage)
	requestAnimFrame(animate)
}