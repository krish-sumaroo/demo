<div class="col-lg-4 col-sm-6 col-xs-12 inline-list" id="con_{{$user->id}}">
	<div class="widget meta" data="{{$user->name}}">
	    <div class="widget-header {{$styleW}}">
	        <span class="widget-caption">{{$user->name}}</span>
	        <?php	   
	        	$state = $user->active ? "checked='checked'": '';
	        ?>
	        <div class="widget-buttons buttons-bordered">
	            <label>
                    <input class="checkbox-slider memberFlag" {{$state}}  type="checkbox" data-ref="{{$user->id}}" autocomplete="off">
                    <span class="text"></span>
                </label>
	        </div><!--Widget Buttons-->
	    </div><!--Widget Header-->
	    <div class="widget-body">	        
	        <div class="supInfo">
	        	created date : ...... <br />
	        	last activity : ...... <br />

	        	<div class="buttons-preview">
	        		<a href="{{url()}}/members/permissions/{{$user->id}}" class="btn btn-blue shiny">
	        		<i class="fa fa-shield right"></i> Permissions
	        		</a>

	        		<a href="javascript:void(0);" class="btn btn-magenta showPassBox" data-ref="{{$user->id}}">
	        			<i class="fa fa-wrench right"></i> Change Password
	        		</a>
	        	</div>	        	

	        	<div class="passChB" id="chgPassB_{{$user->id}}" style="display:none;">
	        		<label>New password :
	        			<input type="password" class="" name="pass" placeholder="New Password" id="passIn_{{$user->id}}" />
	        		</label>
	        		<br />
	        		<label>Confirm Password :
	        			<input type="password" class="" name="passConf" placeholder="Confirm password" id="passInConf_{{$user->id}}" />
	        		</label>
	        		<div class="buttons-preview">
		        		<a href="javascript:void(0);" class="btn btn-success savePassChg" data-ref="{{$user->id}}">
		        			<i class="fa fa-check right"></i>
		        			 <span>Save</span>
		        		</a>
		        		<a href="javascript:void(0);" class="btn btn-danger exitPassChg" data-ref="{{$user->id}}">
		        			<i class="fa fa-times right"></i>
		        			 Cancel
		        		</a>
	        		</div>	        			 		
	        	</div> 
	        </div>
	    </div><!--Widget Body-->
	</div><!--Widget-->
</div>