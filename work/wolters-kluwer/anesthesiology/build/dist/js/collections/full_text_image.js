define(["underscore","backbone","models/global"],function(e,t,n){var r=t.Collection.extend({globalModel:null,imageId:null,artAccNum:null,initialize:function(){this.globalModel=new n},parse:function(e){var t=[],n=new Object;return n.Description=$(e).find("Description").text(),n.ImageURL=$(e).find("ImageURL").text(),t.push(n),t},fetch:function(e){var n=this.globalModel.full_image_by_accession_number.replace("{imageId}",this.imageId);n=n.replace("{accessionNumber}",this.artAccNum),e||(e={}),e.dataType="xml",e.url=n,t.Collection.prototype.fetch.call(this,e)}});return r});