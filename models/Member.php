<?php namespace mamouCRM\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model {

protected $table = 'users'; 

public function scopeMembers($query,$userId)
{
    return $query->where('owner', '=', $userId);
}  

}