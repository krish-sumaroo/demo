<?php namespace mamouCRM\Repositories\Implementation;
 
 use mamouCRM\Models\Member as Member;
 use mamouCRM\Repositories\Interfaces\IMemberRepository;
 use DB;

 class MemberRepository implements IMemberRepository {

 	public function getMembers($ownerId)
 	{
 		
 		return Member::members($ownerId)->get();	 		
 	}

 	public function getPermissions($userId)
 	{
 		$results = DB::select(
 					"SELECT a.id, a.action, p.permission
					FROM `actions` a
					left join 
					(
						select * from permissions
						where user_id = :id
					) as p

					on a.id = p.action_id",['id' => $userId]
 			); 		
 		return $results;
 	}
 }