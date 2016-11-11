@extends('layouts.admin')

@section('content')

<div class="col-lg-12 col-sm-12 col-xs-12">
	<div class="row">
		<div class="col-lg-6 col-sm-12 col-xs-12">
			<h5 class="row-title custom-title">
				Members
				<span class="input-icon pull-right">
                    <input type="text" class="form-control" id="glyphicon-search" placeholder="Search">
                    <i class="glyphicon glyphicon-search circular danger"></i>
                </span>
			</h5>
		</div>

		<!--
		<div class="col-lg-6 col-sm-12 col-xs-12">
			<div class="pull-right">
				<a href="{{Request::root()}}/members/new" class="btn btn-danger btn-circle btn-sm" id="addMember"><i class="glyphicon glyphicon-plus"></i></a>				
			</div>
		</div>	
		-->
	</div>	
</div>

<div class="col-lg-12 col-sm-12 col-xs-12">
	<div class="row" id="membersContainer">
		<?php $widgetStyles= ['bg-palegreen','bg-blue','bg-magenta','bg-blueberry','bg-gold']; ?>

		@foreach($users as $user)
		<?php $styleW = $widgetStyles[mt_rand(0, count($widgetStyles) - 1)]; ?>
			@include('users.detail-widget')		
		@endforeach
	</div>
</div>

@stop