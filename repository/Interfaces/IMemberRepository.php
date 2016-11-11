<?php namespace mamouCRM\Repositories\Interfaces;

interface IMemberRepository {
	public function getMembers($ownerId);
	public function getPermissions($userId);
}