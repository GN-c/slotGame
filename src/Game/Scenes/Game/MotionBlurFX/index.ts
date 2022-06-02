/**
 * Custom shader for adding vertical motion blur on sprites
 */
export default class MotionBlurFX extends Phaser.Renderer.WebGL.Pipelines
  .MultiPipeline {
  static readonly KEY = "motionBlurFX";

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: /* glsl */ `
                precision lowp float; 

                #define Samples 8.

                varying vec2 outTexCoord;
                varying float outTexId;
 
                uniform float blurScale;
                uniform vec2 uTextureSize; 
                uniform sampler2D uMainSampler[%count%]; 

                

                // Get texel correctly from different slots 
                vec4 getSampler(vec2 outTexCoord){ 
                  vec4 texture;
                  %forloop%
                  return texture;
                }
 

                vec4 motionBlur(vec2 uv,float intensity,vec2 direction){
                  vec4 color = vec4(0.);
                  for (float i=1.; i <= Samples; i++)
                  {
                    color += getSampler(uv + (i / Samples) * intensity * direction / uTextureSize);
                    color += getSampler(uv - (i / Samples) * intensity * direction / uTextureSize);
                  }
                  return color / Samples/2.;
                }

                void main(){ 
                    gl_FragColor = motionBlur(outTexCoord,blurScale,vec2(0., -1.));  
                    // gl_FragColor = vec4(outTexCoord.x ,0.,0.,1.);  
                }
            `,
    });
  }

  onBind(
    gameObject: Phaser.GameObjects.GameObject &
      Phaser.GameObjects.Components.Pipeline &
      Phaser.GameObjects.Components.Texture
  ): void {
    super.onBind(gameObject);
    const data = gameObject.pipelineData as { blurScale: number };

    /**
     * Update properties according to each gameObject
     */
    const sourceImage = gameObject.texture.getSourceImage();
    this.set2f("uTextureSize", sourceImage.width, sourceImage.height).set1f(
      "blurScale",
      data.blurScale
    );
  }

  /**
   * Implement Vertical Padding to show overflow when applying motion blur
   */
  batchQuad(
    gameObject: Phaser.GameObjects.Image,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    _u0: number,
    _v0: number,
    _u1: number,
    _v1: number,
    tintTL: number,
    tintTR: number,
    tintBL: number,
    tintBR: number,
    tintEffect: number | boolean,
    texture?: WebGLTexture,
    unit?: number
  ): boolean {
    const sourceImage = gameObject.texture.getSourceImage(),
      frame = gameObject.frame,
      //@ts-ignore
      verticalPadding = Math.abs(
        //@ts-ignore
        gameObject.pipelineData.blurScale as number
      );
    return super.batchQuad(
      gameObject,
      x0,
      y0 - verticalPadding,
      x1,
      y1 + verticalPadding,
      x2,
      y2 + verticalPadding,
      x3,
      y3 - verticalPadding,
      frame.cutX / sourceImage.width,
      (frame.cutY - verticalPadding) / sourceImage.height,
      (frame.cutX + frame.cutWidth) / sourceImage.width,
      (frame.cutY + frame.cutHeight + verticalPadding) / sourceImage.height,
      tintTL,
      tintTR,
      tintBL,
      tintBR,
      tintEffect,
      texture,
      unit
    );
  }
}
