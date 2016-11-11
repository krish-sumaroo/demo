@extends('layouts.admin')

@section('content')

<a href="{{Request::root()}}/members/list" class="btn btn-lg btn-primary">
    <i class="fa fa-backward"></i>Back
</a>

<div class="col-lg-12 col-sm-12 col-xs-12">
	<div class="well with-header">
        <div class="header bg-blue">
            Permissions for : {{$userDetails->name}}
        </div>

        <table class="table table-hover table-bordered center">
        <thead class="bordered-darkorange">
        	<tr class="center-header">
        		<th>Actions</th>
        		<th>Read</th>
        		<th>Write</th>
        		<th>Delete</th>
        	</tr>
        </thead>
        <tbody>        	
        	@foreach($userPermissions as $member)
        	<tr>
         		<td>{{$member->action}}</td>
         		<?php
         			$permission = $member->permission;
         			if($permission)
         			{
         				$rFg = $permission[0] ? "checked='checked'" : '';
         				$wFg = $permission[1] ? "checked='checked'" : '';
         				$dFg = $permission[2] ? "checked='checked'" : '';
         			}
         			else{
         				$rFg = $wFg = $dFg = '';
         			}
         		?>
        		<td><label>
	                    <input class="checkbox-slider slider-icon yesno colored-purple permissionSet" {{$rFg}} type="checkbox" autocomplete="off" data-ref="{{$member->id}}" data-ac="r">
	                    <span class="text"></span>
                	</label>
            	</td>
            	<td><label>
	                    <input class="checkbox-slider slider-icon yesno colored-warning permissionSet" {{$wFg}} type="checkbox" autocomplete="off" data-ref="{{$member->id}}" data-ac="w">
	                    <span class="text"></span>
                	</label>
            	</td>
            	<td><label>
	                    <input class="checkbox-slider slider-icon yesno colored-darkorange permissionSet" {{$dFg}} type="checkbox" autocomplete="off" data-ref="{{$member->id}}" data-ac="d">
	                    <span class="text"></span>
                	</label>
                </td>
        	</tr>

        	@endforeach        	       	
        </tbody>
    </table>
    </div>


</div>	
@stop
