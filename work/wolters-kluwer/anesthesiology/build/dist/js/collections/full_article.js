define(["underscore","backbone","models/global"],function(e,t,n){var r=t.Collection.extend({globalModel:null,artAccNum:null,initialize:function(){this.globalModel=new n},parse:function(e){var t=[],n=new Object;return n.HTMLText=null,$(e).find("ArticleFullTextHTML").each(function(){var e=$(this).text();e=e.replace("<![CDATA[",""),e=e.replace("]]>","");var n=new Object;n.HTMLText=e,t.push(n)}),t},fetch:function(e){var n=this.globalModel.full_text_by_accession_number.replace("{imageId}",this.imageId);n=n.replace("{accessionNumber}",this.artAccNum),e||(e={}),e.dataType="xml",e.url=n,t.Collection.prototype.fetch.call(this,e)}});return r});